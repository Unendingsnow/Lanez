const SOURCE = 'https://www.cardinalbeachbowl.com/leagues/mens-textile/';

function plain(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&')
    .replace(/&#039;|&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ').trim();
}

export function parseSchedule(html) {
  const marker = 'data-panel-id="lanes"';
  const start = html.indexOf(marker);
  if (start < 0) return [];
  const section = html.slice(start);
  const chunks = section.split('<div class="bs-la-week">').slice(1, 3);
  const weeks = [];

  for (const chunk of chunks) {
    const week = Number(chunk.match(/bs-week-badge"[^>]*>\s*Week\s*(\d+)/)?.[1]);
    const date = plain(chunk.match(/bs-la-date"[^>]*>([\s\S]*?)<\/span>/)?.[1] || '');
    const games = [];

    for (const row of chunk.matchAll(/<tr class="bs-row-[^"]+">([\s\S]*?)<\/tr>/g)) {
      const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(m => m[1]);
      if (cells.length !== 4) continue;
      const getTeam = cell => [
        Number(cell.match(/data-team="(\d+)"/)?.[1]),
        plain(cell.match(/class="bs-team-link"[^>]*>([\s\S]*?)<\/a>/)?.[1] || '')
      ];
      const home = getTeam(cells[1]);
      const away = getTeam(cells[3]);
      if (home[0] && away[0]) games.push([plain(cells[0]), ...home, ...away]);
    }

    if (week && date && games.length) weeks.push({ week, date, games });
  }
  return weeks;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
  try {
    const response = await fetch(SOURCE, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Lanez/1.0)' },
      signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) throw new Error(`Official site returned ${response.status}`);
    const weeks = parseSchedule(await response.text());
    if (weeks.length !== 2 || weeks.some(w => w.games.length !== 6)) {
      throw new Error('The official site did not publish two complete lane schedules');
    }
    return res.status(200).json({ weeks, checkedAt: new Date().toISOString(), fallback: false });
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({
      error: 'Unable to retrieve current assignments',
      detail: String(error),
      weeks: []
    });
  }
}
