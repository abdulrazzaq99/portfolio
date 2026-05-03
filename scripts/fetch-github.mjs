#!/usr/bin/env node
/**
 * Refresh the GitHub-driven data the portfolio uses (currently the contribution calendar).
 * Reads GITHUB_TOKEN + GITHUB_USERNAME from .env.local.
 * Token stays server-side; nothing here ships to the client bundle.
 *
 * Usage:  node scripts/fetch-github.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

async function loadEnv() {
  const file = path.join(root, ".env.local");
  const text = await fs.readFile(file, "utf8").catch(() => "");
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
  }
}
await loadEnv();

const TOKEN = process.env.GITHUB_TOKEN;
const USER = process.env.GITHUB_USERNAME ?? "abdulrazzaq99";
if (!TOKEN) {
  console.error("✗ GITHUB_TOKEN not set in .env.local");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

const query = `query { user(login: "${USER}") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount weekday } } } } } }`;

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: { ...headers, "Content-Type": "application/json" },
  body: JSON.stringify({ query }),
});

if (!res.ok) {
  console.error(`✗ GraphQL ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const json = await res.json();
if (json.errors) {
  console.error("✗ GraphQL errors:", json.errors);
  process.exit(1);
}

const cal = json.data.user.contributionsCollection.contributionCalendar;
const out = {
  total: cal.totalContributions,
  weeks: cal.weeks.map((w) => w.contributionDays.map((d) => d.contributionCount)),
  lastDate: cal.weeks.at(-1).contributionDays.at(-1).date,
  fetchedAt: new Date().toISOString(),
};

const dest = path.join(root, "src/data/contributions.json");
await fs.writeFile(dest, JSON.stringify(out));
console.log(`✓ Wrote ${dest}`);
console.log(`  total: ${out.total} contributions over ${out.weeks.length} weeks`);
console.log(`  lastDate: ${out.lastDate}`);
