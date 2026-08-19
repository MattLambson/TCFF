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

  /* ---------- Draft-day countdown ---------- */
  const cdEl = document.getElementById('draft-countdown');
  if (cdEl) {
    const target = new Date('2026-08-30T22:30:00Z').getTime(); // 6:30 PM ET (EDT, UTC-4)
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');
    const pad = n => String(n).padStart(2, '0');

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        daysEl.textContent = hoursEl.textContent = minsEl.textContent = secsEl.textContent = '00';
        clearInterval(timer);
        return;
      }
      daysEl.textContent = pad(Math.floor(diff / 86400000));
      hoursEl.textContent = pad(Math.floor((diff % 86400000) / 3600000));
      minsEl.textContent = pad(Math.floor((diff % 3600000) / 60000));
      secsEl.textContent = pad(Math.floor((diff % 60000) / 1000));
    };
    tick();
    const timer = setInterval(tick, 1000);
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

      const rankTd = document.createElement('td');
      rankTd.className = 'num';
      rankTd.textContent = p.rank;

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

      tr.append(rankTd, playerTd, posTd, teamTd, posRankTd, byeTd);
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

      const frag = document.createDocumentFragment();
      orderedRows.forEach(row => {
        const rank = Number(row.dataset.rank);
        const matchesFilter = activeFilter === 'ALL'
          || (activeFilter === 'FAV' && favorites.has(rank))
          || row.dataset.pos === activeFilter;
        const show = matchesFilter && !(hideDrafted && drafted.has(rank));
        row.style.display = show ? '' : 'none';
        if (show) visibleCount++;
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

    if (hideDrafted) applyFilter();
  }

});
