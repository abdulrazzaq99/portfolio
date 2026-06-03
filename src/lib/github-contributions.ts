/**
 * GitHub contributions fetcher — used by the Activity ("Days I Code") section.
 *
 * Two backends with the same return shape:
 *
 *   1. OFFICIAL — GitHub GraphQL ContributionsCollection. Requires
 *      `GITHUB_TOKEN` env var (Personal Access Token with at least
 *      `read:user`). Reliable, authoritative.
 *
 *   2. UNOFFICIAL — github-contributions-api.jogruber.de (a community
 *      scraper). No token required. Used when GITHUB_TOKEN is absent.
 *
 * Both are wrapped in Next.js `fetch` ISR with a 6h revalidate so the
 * portfolio doesn't hammer either source and TTFB stays fast.
 *
 * If both fail, the caller should fall back to the static
 * `src/data/contributions.json` snapshot so the section never breaks.
 */

export type ContributionData = {
  total: number;
  /** 53 columns × up to 7 rows (Sun-aligned). Last column may be partial. */
  weeks: number[][];
  /** ISO YYYY-MM-DD of the most recent day in the dataset. */
  lastDate: string;
};

type Day = { date: string; count: number };

const REVALIDATE_SECONDS = 6 * 60 * 60; // 6 hours

export async function fetchContributions(username: string): Promise<ContributionData | null> {
  const token = process.env.GITHUB_TOKEN;
  // Try official first if a token is present; on auth/scope failures fall
  // through to the unofficial source instead of giving up entirely.
  if (token) {
    try {
      return await fetchOfficial(username, token);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("[github-contributions] official failed, trying unofficial:", msg);
    }
  }
  try {
    return await fetchUnofficial(username);
  } catch (err) {
    console.error("[github-contributions] all sources failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

/* ──────────────────────────────────────────────────────────
   Unofficial (no token)
   ────────────────────────────────────────────────────────── */
async function fetchUnofficial(username: string): Promise<ContributionData> {
  // `?y=last` returns rolling 12 months of daily contributions.
  const url = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`unofficial API ${res.status}`);
  const json = (await res.json()) as {
    total: Record<string, number>;
    contributions: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }>;
  };
  return toGrid(json.contributions.map((c) => ({ date: c.date, count: c.count })));
}

/* ──────────────────────────────────────────────────────────
   Official GitHub GraphQL (requires PAT)
   ────────────────────────────────────────────────────────── */
async function fetchOfficial(username: string, token: string): Promise<ContributionData> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }`,
      variables: { login: username },
    }),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`graphql ${res.status}`);
  const json = (await res.json()) as {
    data?: {
      user?: {
        contributionsCollection?: {
          contributionCalendar?: {
            totalContributions: number;
            weeks: Array<{
              contributionDays: Array<{ date: string; contributionCount: number }>;
            }>;
          };
        };
      };
    };
    errors?: Array<{ message: string }>;
  };
  if (json.errors?.length) throw new Error(`graphql: ${json.errors.map((e) => e.message).join("; ")}`);
  const cal = json.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) throw new Error("graphql: missing contributionCalendar");
  const days: Day[] = [];
  for (const w of cal.weeks) {
    for (const d of w.contributionDays) {
      days.push({ date: d.date, count: d.contributionCount });
    }
  }
  return toGrid(days);
}

/* ──────────────────────────────────────────────────────────
   Shape the flat day array into a 53-column Sun-aligned grid.
   Matches the existing static snapshot format exactly.
   ────────────────────────────────────────────────────────── */
function toGrid(days: Day[]): ContributionData {
  if (days.length === 0) {
    return { total: 0, weeks: [], lastDate: new Date().toISOString().slice(0, 10) };
  }
  const sorted = days.slice().sort((a, b) => a.date.localeCompare(b.date));
  const total = sorted.reduce((n, d) => n + d.count, 0);
  const lastDate = sorted[sorted.length - 1].date;
  const map = new Map(sorted.map((d) => [d.date, d.count]));

  const last = new Date(lastDate + "T00:00:00Z");
  const lastDay = last.getUTCDay(); // 0 = Sun
  const lastSunday = new Date(last);
  lastSunday.setUTCDate(last.getUTCDate() - lastDay);

  // 52 weeks before the last Sunday + the trailing partial week.
  const firstSunday = new Date(lastSunday);
  firstSunday.setUTCDate(lastSunday.getUTCDate() - 52 * 7);

  const weeks: number[][] = [];
  for (let w = 0; w < 53; w += 1) {
    const week: number[] = [];
    const sunday = new Date(firstSunday);
    sunday.setUTCDate(firstSunday.getUTCDate() + w * 7);
    for (let d = 0; d < 7; d += 1) {
      const dayDate = new Date(sunday);
      dayDate.setUTCDate(sunday.getUTCDate() + d);
      if (dayDate > last) break; // don't include future cells in the trailing week
      const iso = dayDate.toISOString().slice(0, 10);
      week.push(map.get(iso) ?? 0);
    }
    weeks.push(week);
  }

  return { total, weeks, lastDate };
}
