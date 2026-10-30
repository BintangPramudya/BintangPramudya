const fs = require("fs");
const path = require("path");

const LOGIN = process.env.GH_LOGIN || "BintangPramudya";
const TOKEN = process.env.GITHUB_TOKEN;
const OUT_DIR = process.env.OUTPUT_DIR || "dist";

const ICONS = {
  graph: '<path d="M1.5 1.75V13.5h13.75a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75V1.75a.75.75 0 0 1 1.5 0Zm14.28 2.53-5.25 5.25a.75.75 0 0 1-1.06 0L7 7.06 4.28 9.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.25-3.25a.75.75 0 0 1 1.06 0L10 7.94l4.72-4.72a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"/>',
  star: '<path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"/>',
  commit: '<path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"/>',
  pr: '<path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"/>',
  issue: '<path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"/>',
  repo: '<path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/>',
  people: '<path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z"/>',
};

const THEMES = {
  dark: {
    bg: "#0F172A",
    border: "#1E293B",
    title: "#FBBF24",
    text: "#F8FAFC",
    muted: "#94A3B8",
    accent: "#FBBF24",
    other: "#334155",
  },
  light: {
    bg: "#FFFFFF",
    border: "#E2E8F0",
    title: "#B45309",
    text: "#0F172A",
    muted: "#64748B",
    accent: "#D97706",
    other: "#CBD5E1",
  },
};

const FONT = "'Segoe UI', Ubuntu, 'Helvetica Neue', Arial, sans-serif";
const FALLBACK_COLORS = ["#F1E05A", "#4F5D95", "#3178C6", "#F7523F", "#DA5B0B", "#00B4AB"];

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmt(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

async function fetchStats() {
  if (!TOKEN) throw new Error("GITHUB_TOKEN is required");

  const query = `
    query($login: String!) {
      user(login: $login) {
        repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
          nodes {
            isPrivate
            stargazerCount
            languages(first: 20, orderBy: { field: SIZE, direction: DESC }) {
              edges { size node { name color } }
            }
          }
        }
        followers { totalCount }
        contributionsCollection {
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "bintang-profile-stats",
    },
    body: JSON.stringify({ query, variables: { login: LOGIN } }),
  });

  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors && json.errors.length) throw new Error(JSON.stringify(json.errors));

  const user = json.data.user;
  const repos = user.repositories.nodes.filter((repo) => !repo.isPrivate);
  const stars = repos.reduce((sum, repo) => sum + repo.stargazerCount, 0);

  const langs = new Map();
  for (const repo of repos) {
    for (const edge of repo.languages.edges) {
      const name = edge.node.name;
      if (["HTML", "CSS"].includes(name)) continue;
      const current = langs.get(name) || { size: 0, color: edge.node.color };
      current.size += edge.size;
      if (!current.color) current.color = edge.node.color;
      langs.set(name, current);
    }
  }

  const totalBytes = [...langs.values()].reduce((sum, lang) => sum + lang.size, 0);
  const sorted = [...langs.entries()].sort((a, b) => b[1].size - a[1].size);
  const top = sorted.slice(0, 7).map(([name, lang], index) => ({
    name,
    color: lang.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
    pct: (lang.size / totalBytes) * 100,
    size: lang.size,
  }));
  const topBytes = top.reduce((sum, lang) => sum + lang.size, 0);
  const otherBytes = totalBytes - topBytes;
  const languages = [...top];
  if (otherBytes > 0) {
    languages.push({ name: "Other", color: null, pct: (otherBytes / totalBytes) * 100, size: otherBytes });
  }

  return {
    stars,
    commits: user.contributionsCollection.totalCommitContributions,
    prs: user.contributionsCollection.totalPullRequestContributions,
    issues: user.contributionsCollection.totalIssueContributions,
    repos: repos.length,
    followers: user.followers.totalCount,
    languages,
  };
}

function cell(theme, x, y, icon, label, value) {
  return `
    <g transform="translate(${x} ${y - 10}) scale(0.75)" fill="${theme.accent}">${ICONS[icon]}</g>
    <text x="${x + 17}" y="${y}" font-family="${FONT}" font-size="11.5" fill="${theme.muted}">${esc(label)}</text>
    <text x="${x}" y="${y + 21}" font-family="${FONT}" font-size="21" font-weight="700" fill="${theme.text}">${fmt(value)}</text>`;
}

function statsCard(theme, stats) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="180" viewBox="0 0 495 180" role="img" aria-label="GitHub stats for ${esc(LOGIN)}">
  <rect x="0.5" y="0.5" width="494" height="179" rx="12" fill="${theme.bg}" stroke="${theme.border}"/>
  <g transform="translate(24 19) scale(0.9)" fill="${theme.title}">${ICONS.graph}</g>
  <text x="46" y="33" font-family="${FONT}" font-size="15" font-weight="700" fill="${theme.title}">GitHub Stats</text>
  <line x1="24" y1="46" x2="471" y2="46" stroke="${theme.border}"/>
  ${cell(theme, 24, 66, "star", "Stars", stats.stars)}
  ${cell(theme, 258, 66, "commit", "Commits", stats.commits)}
  ${cell(theme, 24, 102, "pr", "Pull Requests", stats.prs)}
  ${cell(theme, 258, 102, "issue", "Issues", stats.issues)}
  ${cell(theme, 24, 138, "repo", "Repositories", stats.repos)}
  ${cell(theme, 258, 138, "people", "Followers", stats.followers)}
  <text x="471" y="173" text-anchor="end" font-family="${FONT}" font-size="9.5" fill="${theme.muted}">commits, PRs &amp; issues: last 12 months</text>
</svg>
`;
}

function langsCard(theme, stats) {
  const languages = stats.languages;
  const total = languages.reduce((sum, lang) => sum + lang.pct, 0);
  let offset = 0;
  const segments = languages
    .map((lang) => {
      const width = (lang.pct / total) * 447;
      const segment = `<rect x="${(24 + offset).toFixed(2)}" y="48" width="${width.toFixed(2)}" height="10" fill="${lang.color || theme.other}"/>`;
      offset += width;
      return segment;
    })
    .join("\n    ");

  const cols = [24, 258];
  const rows = [86, 110, 134, 158];
  const legends = languages
    .map((lang, index) => {
      const x = cols[index % 2];
      const y = rows[Math.floor(index / 2)];
      if (y === undefined) return "";
      return `
    <circle cx="${x}" cy="${y - 4}" r="4.5" fill="${lang.color || theme.other}"/>
    <text x="${x + 13}" y="${y}" font-family="${FONT}" font-size="11.5" fill="${theme.text}">${esc(lang.name)}</text>
    <text x="${x + 212}" y="${y}" text-anchor="end" font-family="${FONT}" font-size="11.5" font-weight="600" fill="${theme.muted}">${lang.pct.toFixed(1)}%</text>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="180" viewBox="0 0 495 180" role="img" aria-label="Most used languages for ${esc(LOGIN)}">
  <rect x="0.5" y="0.5" width="494" height="179" rx="12" fill="${theme.bg}" stroke="${theme.border}"/>
  <text x="24" y="32" font-family="${FONT}" font-size="15" font-weight="700" fill="${theme.title}">Most Used Languages</text>
  <text x="471" y="32" text-anchor="end" font-family="${FONT}" font-size="9.5" fill="${theme.muted}">public repos · by code size</text>
  <clipPath id="langBar"><rect x="24" y="48" width="447" height="10" rx="5"/></clipPath>
  <g clip-path="url(#langBar)">
    ${segments}
  </g>
  ${legends}
  <text x="471" y="173" text-anchor="end" font-family="${FONT}" font-size="9.5" fill="${theme.muted}">HTML &amp; CSS excluded</text>
</svg>
`;
}

async function main() {
  const stats = await fetchStats();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const [name, theme] of Object.entries(THEMES)) {
    fs.writeFileSync(path.join(OUT_DIR, `stats-${name}.svg`), statsCard(theme, stats));
    fs.writeFileSync(path.join(OUT_DIR, `langs-${name}.svg`), langsCard(theme, stats));
  }
  console.log(
    `Generated cards for ${LOGIN}: ${stats.repos} repos, ${stats.stars} stars, ${stats.commits} commits, ${stats.languages.length} language rows`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
