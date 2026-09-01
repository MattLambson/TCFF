// TCFF — site interactions: active-nav on scroll, mobile rail toggle,
// draft-guide filter chips, reveal-on-scroll.

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Active nav link on scroll ---------- */
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href$="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-15% 0px -70% 0px' });
  sections.forEach(s => navObserver.observe(s));

  /* ---------- Mobile sidebar toggle ---------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.querySelector('.sidebar-backdrop');

  function closeSidebar(){
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
  }
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      backdrop.classList.toggle('open');
    });
  }
  if (backdrop) backdrop.addEventListener('click', closeSidebar);
  links.forEach(l => l.addEventListener('click', closeSidebar));

  /* ---------- Weekly high scorers ---------- */
  const TROPHY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 21h8M12 17v4M7 4h10l-1 8a4 4 0 01-8 0L7 4z"/><path d="M7 5H4a1 1 0 00-1 1v1a4 4 0 004 4M17 5h3a1 1 0 011 1v1a4 4 0 01-4 4"/></svg>';

  const hsHome = document.getElementById('hs-home');
  const hsLatest = document.getElementById('hs-latest');
  const hsArchive = document.getElementById('hs-archive');

  if ((hsHome || hsLatest || hsArchive) && typeof TOP_SCORERS !== 'undefined') {
    // Newest week first, whatever order the data file happens to be in.
    const weeks = TOP_SCORERS.slice().sort((a, b) => b.week - a.week);
    const fmtPts = n => Number(n).toFixed(2);

    const featuredCard = (entry) => {
      const note = entry.note
        ? `<div class="hs-note">${entry.note}</div>`
        : '';
      return `
        <div class="hs-card reveal">
          <div class="hs-rays" aria-hidden="true"></div>
          <div class="hs-confetti" aria-hidden="true">
            ${Array.from({ length: 9 }, (_, i) => `<span class="hs-dot hs-dot-${i + 1}"></span>`).join('')}
          </div>
          <div class="hs-body">
            <div class="hs-week">Week ${entry.week} · High Score</div>
            <div class="hs-trophy">${TROPHY_ICON}</div>
            <div class="hs-points">${fmtPts(entry.points)}</div>
            <div class="hs-points-label">points</div>
            <div class="hs-team">${entry.team}</div>
            <div class="hs-manager">${entry.manager}</div>
            ${note}
          </div>
        </div>`;
    };

    const emptyCard = (sub) => `
      <div class="card reveal empty-state">
        ${TROPHY_ICON}
        <div class="empty-state-title">No games played yet</div>
        <div class="empty-state-sub">${sub}</div>
      </div>`;

    if (hsHome) {
      hsHome.innerHTML = weeks.length
        ? featuredCard(weeks[0])
        : emptyCard('The week\'s top score shows up here once Week 1 wraps.');
    }

    if (hsLatest) {
      hsLatest.innerHTML = weeks.length
        ? featuredCard(weeks[0])
        : emptyCard('Weekly high scores will be listed here once Week 1 wraps.');
    }

    // Everything before the current week, as a running season list.
    if (hsArchive && weeks.length > 1) {
      const rows = weeks.slice(1).map(e => `
        <tr>
          <td class="num">${e.week}</td>
          <td>${e.team}${e.note ? `<div class="hs-row-note">${e.note}</div>` : ''}</td>
          <td class="text-fog">${e.manager}</td>
          <td class="num hs-row-pts">${fmtPts(e.points)}</td>
        </tr>`).join('');

      hsArchive.innerHTML = `
        <div class="section-head" style="margin-top:var(--s-8);">
          <h2 style="margin:0;">Earlier Weeks</h2>
        </div>
        <div class="table-wrap reveal">
          <table>
            <thead>
              <tr><th class="num">Week</th><th>Team</th><th>Manager</th><th class="num">Points</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
    }
  }

  /* ---------- Draft guide board ---------- */
  const STAR_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.6 7.1.7-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7-5.4-4.7 7.1-.7z"/></svg>';
  const FAV_KEY = 'tcff_draftguide_favorites';
  const DRAFTED_KEY = 'tcff_draftguide_drafted';
  const HIDE_DRAFTED_KEY = 'tcff_draftguide_hide_drafted';

  const boardBody = document.getElementById('draft-board-body');

  if (boardBody && typeof DRAFT_BOARD !== 'undefined') {
    const loadSet = (key) => {
      try { return new Set(JSON.parse(localStorage.getItem(key)) || []); }
      catch (e) { return new Set(); }
    };
    const saveSet = (key, set) => localStorage.setItem(key, JSON.stringify([...set]));

    let favorites = loadSet(FAV_KEY);
    let drafted = loadSet(DRAFTED_KEY);
    let hideDrafted = localStorage.getItem(HIDE_DRAFTED_KEY) === '1';

    const frag = document.createDocumentFragment();
    DRAFT_BOARD.forEach(p => {
      const tr = document.createElement('tr');
      tr.dataset.pos = p.pos;
      tr.dataset.rank = p.rank;
      tr.dataset.tier = p.tier;

      const rankTd = document.createElement('td');
      rankTd.className = 'num';
      rankTd.textContent = p.rank;

      const tierTd = document.createElement('td');
      tierTd.className = 'num text-fog';
      tierTd.textContent = p.tier;

      const playerTd = document.createElement('td');
      const cell = document.createElement('div');
      cell.className = 'player-cell';

      const starBtn = document.createElement('button');
      starBtn.className = 'star-btn';
      starBtn.type = 'button';
      starBtn.innerHTML = STAR_ICON;
      starBtn.setAttribute('aria-label', `Favorite ${p.name}`);

      const nameSpan = document.createElement('span');
      nameSpan.className = 'player-name';
      nameSpan.textContent = p.name;

      cell.append(starBtn, nameSpan);
      playerTd.appendChild(cell);

      const posTd = document.createElement('td');
      const posTag = document.createElement('span');
      posTag.className = 'pos-tag';
      posTag.textContent = p.pos;
      posTd.appendChild(posTag);

      const teamTd = document.createElement('td');
      teamTd.className = 'text-fog';
      teamTd.textContent = p.team;

      const posRankTd = document.createElement('td');
      posRankTd.className = 'num text-fog';
      posRankTd.textContent = `${p.pos}${p.posRank}`;

      const byeTd = document.createElement('td');
      byeTd.className = 'num text-fog';
      byeTd.textContent = p.bye ? p.bye : '—';

      tr.append(rankTd, tierTd, playerTd, posTd, teamTd, posRankTd, byeTd);
      frag.appendChild(tr);

      starBtn.addEventListener('click', () => {
        if (favorites.has(p.rank)) favorites.delete(p.rank);
        else favorites.add(p.rank);
        saveSet(FAV_KEY, favorites);
        starBtn.classList.toggle('favorited', favorites.has(p.rank));
        applyFilter();
      });

      nameSpan.addEventListener('click', () => {
        if (drafted.has(p.rank)) drafted.delete(p.rank);
        else drafted.add(p.rank);
        saveSet(DRAFTED_KEY, drafted);
        tr.classList.toggle('drafted', drafted.has(p.rank));
        applyFilter();
      });

      if (favorites.has(p.rank)) starBtn.classList.add('favorited');
      if (drafted.has(p.rank)) tr.classList.add('drafted');
    });
    boardBody.appendChild(frag);

    const chips = document.querySelectorAll('.filter-chip');
    const draftRows = Array.from(document.querySelectorAll('#draftguide tbody tr'));
    const emptyMsg = document.getElementById('draft-board-empty');
    let activeFilter = 'ALL';

    const TIER_COLS = 7;

    function applyFilter() {
      let visibleCount = 0;

      // Outside the Favorites tab, bubble favorited players to the top of
      // whichever filter is active while keeping everyone else in rank order.
      const orderedRows = activeFilter === 'FAV'
        ? draftRows
        : draftRows.slice().sort((a, b) => {
            const aFav = favorites.has(Number(a.dataset.rank)) ? 0 : 1;
            const bFav = favorites.has(Number(b.dataset.rank)) ? 0 : 1;
            return aFav - bFav;
          });

      boardBody.querySelectorAll('.tier-separator').forEach(el => el.remove());

      const frag = document.createDocumentFragment();
      let lastVisibleTier = null;
      orderedRows.forEach(row => {
        const rank = Number(row.dataset.rank);
        const matchesFilter = activeFilter === 'ALL'
          || (activeFilter === 'FAV' && favorites.has(rank))
          || row.dataset.pos === activeFilter;
        const show = matchesFilter && !(hideDrafted && drafted.has(rank));
        row.style.display = show ? '' : 'none';
        if (show) {
          if (lastVisibleTier !== null && row.dataset.tier !== lastVisibleTier) {
            const sepTr = document.createElement('tr');
            sepTr.className = 'tier-separator';
            const sepTd = document.createElement('td');
            sepTd.colSpan = TIER_COLS;
            sepTr.appendChild(sepTd);
            frag.appendChild(sepTr);
          }
          lastVisibleTier = row.dataset.tier;
          visibleCount++;
        }
        frag.appendChild(row);
      });
      boardBody.appendChild(frag);

      if (emptyMsg) emptyMsg.style.display = (activeFilter === 'FAV' && visibleCount === 0) ? '' : 'none';
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeFilter = chip.dataset.pos;
        applyFilter();
      });
    });

    const hideDraftedToggle = document.getElementById('hide-drafted-toggle');
    if (hideDraftedToggle) {
      hideDraftedToggle.checked = hideDrafted;
      hideDraftedToggle.addEventListener('change', () => {
        hideDrafted = hideDraftedToggle.checked;
        localStorage.setItem(HIDE_DRAFTED_KEY, hideDrafted ? '1' : '0');
        applyFilter();
      });
    }

    const clearBtn = document.getElementById('draft-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (!favorites.size && !drafted.size) return;
        if (!confirm('Clear all favorites and drafted players? This cannot be undone.')) return;
        favorites.clear();
        drafted.clear();
        saveSet(FAV_KEY, favorites);
        saveSet(DRAFTED_KEY, drafted);
        draftRows.forEach(row => {
          row.classList.remove('drafted');
          const star = row.querySelector('.star-btn');
          if (star) star.classList.remove('favorited');
        });
        applyFilter();
      });
    }

    applyFilter();
  }

});
