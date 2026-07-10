const username = "ashishkumar62649";
let cached = null;
let cachedAt = 0;

const queries = {
  merged: `author:${username} type:pr is:merged`,
  open: `author:${username} type:pr is:open`,
  closed: `author:${username} type:pr is:closed is:unmerged`,
};

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (cached && Date.now() - cachedAt < 5 * 60 * 1000) {
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json(cached);
  }

  const headers = { Accept: "application/vnd.github+json", Authorization: `Bearer ${process.env.GITHUB_TOKEN}` };
  try {
    const [contributions, ...prResults] = await Promise.all([
      fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ query: `query { user(login: "${username}") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { contributionCount date } } } } } }` }),
      }).then((r) => r.json()),
      ...Object.values(queries).map((q) => fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(q)}&sort=created-desc&per_page=50`, { headers }).then((r) => r.json())),
    ]);
    const calendar = contributions.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) throw new Error("GitHub contribution data unavailable");
    const prs = Object.fromEntries(Object.keys(queries).map((tab, i) => [tab, {
      totalCount: prResults[i].total_count || 0,
      items: (prResults[i].items || []).map((item) => ({ id: item.id, title: item.title, repo: item.repository_url.split("/repos/")[1] || "unknown/repo", url: item.html_url, number: item.number, created_at: item.created_at })),
    }]));
    cached = { totalContributions: calendar.totalContributions, weeks: calendar.weeks, prs };
    cachedAt = Date.now();
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json(cached);
  } catch (error) {
    return res.status(502).json({ error: "GitHub data unavailable" });
  }
}
