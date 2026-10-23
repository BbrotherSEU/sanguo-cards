#!/usr/bin/env node
/**
 * Compare challenge.js latency over HTTP/2.
 * - Cache disabled (no-cache headers + unique query)
 * - Spaced requests (default delay 3000ms)
 *
 * Usage:
 *   node scripts/compare-challenge-speed.mjs --rounds 20 --delay 3000
 */

import http2 from "node:http2";
import zlib from "node:zlib";
import { performance } from "node:perf_hooks";

const URLS = {
  preprod:
    "https://hbsg.dxp1.preprod.eu.dynp.cloud1.vv1865.com/hsbc/dxp/challenge.js",
  awswaf: "https://hsbc.edge.sdk.awswaf.com/hsbc/dxp/challenge.js",
};

const args = parseArgs(process.argv.slice(2));
const ROUNDS = args.rounds ?? 20;
const DELAY_MS = args.delay ?? 3000;
const TIMEOUT_MS = args.timeout ?? 30000;

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--rounds" || a === "-n") out.rounds = Number(argv[++i]);
    else if (a === "--delay" || a === "-d") out.delay = Number(argv[++i]);
    else if (a === "--timeout" || a === "-t") out.timeout = Number(argv[++i]);
    else if (a === "--help" || a === "-h") {
      console.log(`Usage: node scripts/compare-challenge-speed.mjs [options]

Options:
  -n, --rounds <n>    Samples per URL (default: 20)
  -d, --delay <ms>    Delay between each request (default: 3000)
  -t, --timeout <ms>  Per-request timeout (default: 30000)
`);
      process.exit(0);
    }
  }
  return out;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function decompress(buf, encoding) {
  const enc = (encoding || "").toLowerCase();
  if (!enc || enc === "identity") return buf;
  if (enc.includes("br")) return zlib.brotliDecompressSync(buf);
  if (enc.includes("gzip")) return zlib.gunzipSync(buf);
  if (enc.includes("deflate")) return zlib.inflateSync(buf);
  return buf;
}

function fetchHttp2(label, baseUrl) {
  const url = new URL(baseUrl);
  url.searchParams.set(
    "_nocache",
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );

  return new Promise((resolve) => {
    const started = performance.now();
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        client.close();
      } catch {
        /* ignore */
      }
      resolve(result);
    };

    const client = http2.connect(`${url.protocol}//${url.host}`, {
      // match browser a bit: prefer h2
      settings: { enablePush: false },
    });

    const timer = setTimeout(() => {
      try {
        client.destroy();
      } catch {
        /* ignore */
      }
      finish({
        label,
        ok: false,
        status: 0,
        ms: performance.now() - started,
        wireBytes: null,
        decodedBytes: null,
        protocol: "h2",
        encoding: null,
        error: "timeout",
      });
    }, TIMEOUT_MS);

    client.on("error", (err) => {
      finish({
        label,
        ok: false,
        status: 0,
        ms: performance.now() - started,
        wireBytes: null,
        decodedBytes: null,
        protocol: "h2",
        encoding: null,
        error: String(err.message || err),
      });
    });

    const req = client.request({
      ":method": "GET",
      ":path": url.pathname + url.search,
      ":scheme": "https",
      ":authority": url.host,
      accept: "*/*",
      "accept-encoding": "gzip, deflate, br",
      "cache-control": "no-cache, no-store, must-revalidate",
      pragma: "no-cache",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    });

    const chunks = [];
    let status = 0;
    let encoding = "";

    req.on("response", (headers) => {
      status = Number(headers[":status"] || 0);
      encoding = headers["content-encoding"] || "";
    });

    req.on("data", (chunk) => chunks.push(chunk));

    req.on("end", () => {
      const ms = performance.now() - started;
      const wire = Buffer.concat(chunks);
      let decoded = wire;
      let error = null;
      try {
        decoded = decompress(wire, encoding);
      } catch (e) {
        error = `decompress: ${e.message}`;
      }
      finish({
        label,
        ok: status >= 200 && status < 300 && !error,
        status,
        ms,
        wireBytes: wire.byteLength,
        decodedBytes: decoded.byteLength,
        protocol: "h2",
        encoding: encoding || "identity",
        error: error || (status >= 200 && status < 300 ? null : `HTTP ${status}`),
      });
    });

    req.on("error", (err) => {
      finish({
        label,
        ok: false,
        status,
        ms: performance.now() - started,
        wireBytes: null,
        decodedBytes: null,
        protocol: "h2",
        encoding: null,
        error: String(err.message || err),
      });
    });

    req.end();
  });
}

function stats(samples) {
  const ok = samples.filter((s) => s.ok);
  const times = ok.map((s) => s.ms).sort((a, b) => a - b);
  if (!times.length) {
    return { count: samples.length, ok: 0, fail: samples.length };
  }
  const sum = times.reduce((a, b) => a + b, 0);
  const avg = sum / times.length;
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
    avg,
    p50,
    p95: times[p95Idx],
    wireBytes: ok[0]?.wireBytes ?? null,
    decodedBytes: ok[0]?.decodedBytes ?? null,
    encoding: ok[0]?.encoding ?? null,
  };
}

function fmt(ms) {
  return `${ms.toFixed(1)} ms`;
}

function printSample(i, total, r) {
  const tag = r.ok ? "OK" : "FAIL";
  const extra = [
    r.protocol,
    r.encoding,
    r.wireBytes != null ? `wire=${r.wireBytes}B` : null,
    r.decodedBytes != null ? `decoded=${r.decodedBytes}B` : null,
    r.error,
  ]
    .filter(Boolean)
    .join(", ");
  console.log(
    `  [${i}/${total}] ${r.label.padEnd(8)} ${tag.padEnd(4)} ${fmt(r.ms).padStart(12)}  ${extra}`
  );
}

function printSummary(name, url, s) {
  console.log(`\n── ${name} ──`);
  console.log(`  URL: ${url}`);
  console.log(
    `  success: ${s.ok}/${s.count}` + (s.fail ? `  (fail: ${s.fail})` : "")
  );
  if (!s.ok) return;
  console.log(`  min:  ${fmt(s.min)}`);
  console.log(`  avg:  ${fmt(s.avg)}`);
  console.log(`  p50:  ${fmt(s.p50)}`);
  console.log(`  p95:  ${fmt(s.p95)}`);
  console.log(`  max:  ${fmt(s.max)}`);
  if (s.wireBytes != null) {
    console.log(
      `  size: wire=${s.wireBytes}B decoded=${s.decodedBytes}B encoding=${s.encoding}`
    );
  }
}

async function main() {
  const names = Object.keys(URLS);
  console.log("Challenge.js latency comparison (HTTP/2)");
  console.log(
    `rounds/url: ${ROUNDS}  delay: ${DELAY_MS} ms  timeout: ${TIMEOUT_MS} ms`
  );
  console.log(
    "cache: disabled · accept-encoding: gzip, deflate, br · protocol: h2\n"
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
      const r = await fetchHttp2(name, URLS[name]);
      results[name].push(r);
      printSample(step, total, r);
    }
  }

  console.log("\n========== SUMMARY ==========");
  const summaries = {};
  for (const name of names) {
    summaries[name] = stats(results[name]);
    printSummary(name, URLS[name], summaries[name]);
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

  // machine-readable for aggregation
  console.log(
    "\n__JSON__" +
      JSON.stringify({
        client: "node-http2",
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
