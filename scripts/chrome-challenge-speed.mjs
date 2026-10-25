#!/usr/bin/env node
/**
 * System Chrome challenge.js latency test.
 * - Fresh Chrome instance per request (unique --user-data-dir)
 * - Cache disabled (flags + CDP Network.setCacheDisabled)
 * - Spaced requests (default delay 3000ms)
 *
 * Usage:
 *   node scripts/chrome-challenge-speed.mjs --rounds 20 --delay 3000
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { performance } from "node:perf_hooks";
import puppeteer from "puppeteer-core";

const URLS = {
  preprod:
    "https://hbsg.dxp1.preprod.eu.dynp.cloud1.vv1865.com/hsbc/dxp/challenge.js",
  awswaf: "https://hsbc.edge.sdk.awswaf.com/hsbc/dxp/challenge.js",
};

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  path.join(
    process.env.LOCALAPPDATA || "",
    "Google\\Chrome\\Application\\chrome.exe"
  ),
].filter(Boolean);

const args = parseArgs(process.argv.slice(2));
const ROUNDS = args.rounds ?? 20;
const DELAY_MS = args.delay ?? 3000;
const TIMEOUT_MS = args.timeout ?? 45000;
const HEADLESS = args.headless ?? true; // fresh real Chrome; headless avoids 40 visible windows

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--rounds" || a === "-n") out.rounds = Number(argv[++i]);
    else if (a === "--delay" || a === "-d") out.delay = Number(argv[++i]);
    else if (a === "--timeout" || a === "-t") out.timeout = Number(argv[++i]);
    else if (a === "--headed") out.headless = false;
    else if (a === "--headless") out.headless = true;
    else if (a === "--help" || a === "-h") {
      console.log(`Usage: node scripts/chrome-challenge-speed.mjs [options]

Options:
  -n, --rounds <n>    Samples per URL (default: 20)
  -d, --delay <ms>    Delay between each request (default: 3000)
  -t, --timeout <ms>  Per-request timeout (default: 45000)
      --headed         Show Chrome windows (default: headless)
`);
      process.exit(0);
    }
  }
  return out;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function findChrome() {
  for (const p of CHROME_CANDIDATES) {
    if (p && fs.existsSync(p)) return p;
  }
  throw new Error(
    "Chrome not found. Set CHROME_PATH or install Google Chrome."
  );
}

function rimrafSafe(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

function stats(samples) {
  const ok = samples.filter((s) => s.ok);
  const times = ok.map((s) => s.ms).sort((a, b) => a - b);
  if (!times.length) {
    return { count: samples.length, ok: 0, fail: samples.length };
  }
  const sum = times.reduce((a, b) => a + b, 0);
  const mid = Math.floor(times.length / 2);
  const p50 =
    times.length % 2 === 0
      ? (times[mid - 1] + times[mid]) / 2
      : times[mid];
  const p95Idx = Math.min(
    times.length - 1,
    Math.ceil(times.length * 0.95) - 1
  );
  return {
    count: samples.length,
    ok: ok.length,
    fail: samples.length - ok.length,
    min: times[0],
    max: times[times.length - 1],
    avg: sum / times.length,
    p50,
    p95: times[p95Idx],
  };
}

function fmt(ms) {
  return `${ms.toFixed(1)} ms`;
}

/**
 * Launch a brand-new Chrome process for a single navigation measurement.
 */
async function measureOnce(label, baseUrl, chromePath) {
  const url = new URL(baseUrl);
  url.searchParams.set(
    "_nocache",
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
  const href = url.toString();
  const userDataDir = fs.mkdtempSync(
    path.join(os.tmpdir(), `chrome-challenge-${label}-`)
  );

  let browser;
  const wall0 = performance.now();
  try {
    browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: HEADLESS ? "new" : false,
      userDataDir,
      args: [
        "--disable-http-cache",
        "--disk-cache-size=0",
        "--media-cache-size=0",
        "--disable-application-cache",
        "--disable-features=OptimizationHints,InterestFeedContentSuggestions",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-background-networking",
        "--disable-sync",
        "--disable-extensions",
        "--disable-component-update",
      ],
    });

    const page = await browser.newPage();
    const client = await page.createCDPSession();
    await client.send("Network.enable");
    await client.send("Network.setCacheDisabled", { cacheDisabled: true });

    const started = performance.now();
    const response = await page.goto(href, {
      waitUntil: "load",
      timeout: TIMEOUT_MS,
    });
    const wallMs = performance.now() - started;

    const timing = await page.evaluate(() => {
      const n = performance.getEntriesByType("navigation")[0];
      if (!n) return null;
      return {
        duration: n.duration,
        transferSize: n.transferSize,
        encodedBodySize: n.encodedBodySize,
        decodedBodySize: n.decodedBodySize,
        protocol: n.nextHopProtocol,
        ttfb: n.responseStart - n.requestStart,
        download: n.responseEnd - n.responseStart,
      };
    });

    const status = response ? response.status() : 0;
    const ms = timing?.duration > 0 ? timing.duration : wallMs;
    const ok = status >= 200 && status < 300;

    return {
      label,
      ok,
      status,
      ms,
      wallMs,
      transferSize: timing?.transferSize ?? null,
      decodedBodySize: timing?.decodedBodySize ?? null,
      protocol: timing?.protocol ?? null,
      ttfb: timing?.ttfb ?? null,
      download: timing?.download ?? null,
      error: ok ? null : `HTTP ${status}`,
      instanceMs: performance.now() - wall0,
    };
  } catch (err) {
    return {
      label,
      ok: false,
      status: 0,
      ms: performance.now() - wall0,
      wallMs: null,
      transferSize: null,
      decodedBodySize: null,
      protocol: null,
      ttfb: null,
      download: null,
      error: String(err && err.message ? err.message : err),
      instanceMs: performance.now() - wall0,
    };
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {
        /* ignore */
      }
    }
    // Give Chrome a moment to release locks, then wipe profile
    await sleep(200);
    rimrafSafe(userDataDir);
  }
}

async function main() {
  const chromePath = findChrome();
  const names = Object.keys(URLS);

  console.log("Challenge.js latency (system Chrome, fresh instance per request)");
  console.log(`Chrome: ${chromePath}`);
  console.log(
    `rounds/url: ${ROUNDS}  delay: ${DELAY_MS} ms  timeout: ${TIMEOUT_MS} ms  headless: ${HEADLESS}`
  );
  console.log(
    "cache: disabled (CDP + --disable-http-cache + disk-cache-size=0)\n"
  );

  const results = Object.fromEntries(names.map((n) => [n, []]));
  const total = ROUNDS * names.length;
  let step = 0;

  for (let round = 1; round <= ROUNDS; round++) {
    for (const name of names) {
      if (step > 0) {
        process.stdout.write(`  … waiting ${DELAY_MS} ms\n`);
        await sleep(DELAY_MS);
      }
      step++;
      const r = await measureOnce(name, URLS[name], chromePath);
      results[name].push(r);
      const tag = r.ok ? "OK" : "FAIL";
      const extra = [
        r.protocol,
        r.transferSize != null ? `wire=${r.transferSize}B` : null,
        r.decodedBodySize != null ? `decoded=${r.decodedBodySize}B` : null,
        r.error,
      ]
        .filter(Boolean)
        .join(", ");
      console.log(
        `  [${step}/${total}] ${name.padEnd(8)} ${tag.padEnd(4)} ${fmt(r.ms).padStart(12)}  ${extra}`
      );
    }
  }

  console.log("\n========== SUMMARY ==========");
  const summaries = {};
  for (const name of names) {
    const s = stats(results[name]);
    summaries[name] = s;
    console.log(`\n── ${name} ──`);
    console.log(`  URL: ${URLS[name]}`);
    console.log(
      `  success: ${s.ok}/${s.count}` + (s.fail ? `  (fail: ${s.fail})` : "")
    );
    if (!s.ok) continue;
    console.log(`  min:  ${fmt(s.min)}`);
    console.log(`  avg:  ${fmt(s.avg)}`);
    console.log(`  p50:  ${fmt(s.p50)}`);
    console.log(`  p95:  ${fmt(s.p95)}`);
    console.log(`  max:  ${fmt(s.max)}`);
  }

  const a = summaries[names[0]];
  const b = summaries[names[1]];
  if (a.ok && b.ok) {
    const diff = a.avg - b.avg;
    const faster = diff < 0 ? names[0] : names[1];
    const slower = diff < 0 ? names[1] : names[0];
    const ratio = Math.max(a.avg, b.avg) / Math.min(a.avg, b.avg);
    console.log("\n── comparison (by avg) ──");
    console.log(
      `  ${faster} is faster by ${fmt(Math.abs(diff))} (~${ratio.toFixed(2)}x vs ${slower})`
    );
  }

  console.log(
    "\n__JSON__" +
      JSON.stringify({
        client: "system-chrome-fresh-instance",
        chromePath,
        headless: HEADLESS,
        rounds: ROUNDS,
        delayMs: DELAY_MS,
        results,
        summaries,
      })
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
