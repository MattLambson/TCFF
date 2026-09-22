// TCFF — weekly recaps. Add one entry per post as they go up.
// The newest post should go FIRST in the list — the home page hero
// shows RECAPS[0] as the featured "Latest Recap" card, the homepage
// Recaps section shows the first 3, and recaps.html renders the full
// archive.
//
// Fields: date (YYYY-MM-DD, used for sorting), label (short eyebrow
// tag, e.g. "Week 1"), title, teaser, and href (path to the recap
// page, relative to the site root).

const RECAPS = [
  { date: "2026-09-22", label: "Week 2", title: "Week 2 Results Are In",
    teaser: "Three teams move to 2-0, and Draft Punk holds off Yinzers for the week's high score by a single point.",
    href: "recaps/week-2/recap-week-2.html" },
  { date: "2026-09-15", label: "Week 1", title: "Week 1 Results Are In 🏆",
    teaser: "Draft Punk opens the season with 199.90, nearly doubling up Mr. Jackson if you're nasty. Six teams sit at 1-0 heading into Week 2.",
    href: "recaps/week-1/recap-week-1.html" },
  { date: "2026-09-01", label: "Draft Day", title: "The Draft is Complete!",
    teaser: "The 2026 draft is done. Thanks to everyone who came out to draft in person — here's to doing it again next year. 🍻",
    href: "recaps/draft/recap-draft-complete.html" },
  { date: "2026-08-18", label: "Preseason", title: "Draft Order is Set!",
    teaser: "The 2026 draft order is official. See where all twelve teams landed in Round 1. Weekly recaps will start showing up here once Week 1 wraps.",
    href: "recaps/draft/recap-draft-order-set.html" },
];
