// TCFF — weekly high scorers. Add one entry per week as the season goes.
// The newest week should go FIRST in the list — the home page shows
// TOP_SCORERS[0] in the celebration box, and top-scorers.html renders
// the full running list below it.
//
// Fields: week (number), team, manager, points (number), and optional
// `note` for a one-line bit of color (blowouts, records, near-misses).
//
// Example entry:
//   { week: 1, team: "Draft Punk", manager: "Matt", points: 142.56,
//     note: "Rode a 40-point day from the RB2 slot." },

const TOP_SCORERS = [
  { week: 2, team: "Draft Punk", manager: "Matt", points: 145.78,
    note: "Held off Yinzers by a single point (145.78 to 144.74) to keep the title." },
  { week: 1, team: "Draft Punk", manager: "Matt", points: 199.90,
    note: "Nearly doubled up Mr. Jackson if you're nasty, 199.90 to 100.26." },
];
