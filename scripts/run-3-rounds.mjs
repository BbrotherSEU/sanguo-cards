#!/usr/bin/env node
/**
 * Run 3 sequential rounds: Node HTTP/2 then system-Chrome (fresh instance each request).
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const ROUNDS = 3;
const SAMPLES = 20;
const DELAY = 3000;

function run(cmd, args, logFile) {
  return new Promise((resolve, reject) => {
    const out = fs.createWriteStream(logFile, { flags: "w" });
    const child = spawn(cmd, args, {
      cwd: root,
      shell: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let buf = "";
    const onData = (chunk) => {
      const s = chunk.toString();
      buf += s;
      process.stdout.write(s);
      out.write(s);
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.on("close", (code) => {
      out.end();
      const m = buf.match(/__JSON__(.+)$/m);
      let json = null;
      if (m) {
        try {
          json = JSON.parse(m[1]);
        } catch {
          /* ignore */
        }
      }
      if (code !== 0) {
        reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`));
        return;
      }
      resolve(json);
    });
  });
}

function brief(s) {
  if (!s) return "n/a";
  if (!s.ok) return `fail ${s.fail}/${s.count}`;
  return `avg=${s.avg.toFixed(0)} min=${s.min.toFixed(0)} max=${s.max.toFixed(0)} p50=${s.p50.toFixed(0)} (${s.ok}/${s.count})`;
}

async function main() {
  const all = [];
  for (let i = 1; i <= ROUNDS; i++) {
    const tag = `r${i}`;
    console.log(`\n######## ROUND ${i}/${ROUNDS} · Node HTTP/2 ########\n`);
    const nodeLog = path.join(__dirname, `node-h2-20-${tag}.log`);
    const nodeJson = await run(
      "node",
      [
        "scripts/compare-challenge-speed.mjs",
        "--rounds",
        String(SAMPLES),
        "--delay",
        String(DELAY),
      ],
      nodeLog
    );

    console.log(`\n######## ROUND ${i}/${ROUNDS} · System Chrome ########\n`);
    const chromeLog = path.join(__dirname, `chrome-20-${tag}.log`);
    const chromeJson = await run(
      "node",
      [
        "scripts/chrome-challenge-speed.mjs",
        "--rounds",
        String(SAMPLES),
        "--delay",
        String(DELAY),
      ],
      chromeLog
    );

    all.push({
      round: i,
      node: nodeJson?.summaries,
      chrome: chromeJson?.summaries,
    });
  }

  console.log("\n\n============ 3-ROUND AGGREGATE ============\n");
  for (const row of all) {
    console.log(`Round ${row.round}`);
    console.log(`  Node   preprod: ${brief(row.node?.preprod)}`);
    console.log(`  Node   awswaf:  ${brief(row.node?.awswaf)}`);
    console.log(`  Chrome preprod: ${brief(row.chrome?.preprod)}`);
    console.log(`  Chrome awswaf:  ${brief(row.chrome?.awswaf)}`);
    console.log("");
  }

  fs.writeFileSync(
    path.join(__dirname, "three-rounds-summary.json"),
    JSON.stringify(all, null, 2)
  );
  console.log("Wrote scripts/three-rounds-summary.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
