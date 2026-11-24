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
  { week: 11, team: "Yinzers", manager: "Christina", points: 134.38,
    note: "The defending champ's second week on top this season. Edged out Circle The Wagons and Lebowski Bowling Team, 134.38 to 132.74." },
  { week: 10, team: "Draft Punk", manager: "Matt", points: 215.06,
    note: "Highest score of the season and the first over 200. Finished ahead of Whiskey Tango Foxtrot, 215.06 to 186.34." },
  { week: 9, team: "Circle The Wagons", manager: "Jayson", points: 164.08,
    note: "Jayson's second week on top this season, in a 1st-vs-2nd win. Edged out Draft Punk, 164.08 to 156.46." },
  { week: 8, team: "Angry Amish", manager: "Robert", points: 156.96,
    note: "Robert's first week on top this season. Edged out Brian's Nifty Team by 0.16, 156.96 to 156.80." },
  { week: 7, team: "Whiskey Tango Foxtrot", manager: "Alan", points: 147.22,
    note: "Alan's first week on top this season. Edged out In Vrabel we trust, 147.22 to 144.92." },
  { week: 6, team: "Yinzers", manager: "Christina", points: 146.26,
    note: "The defending champ's first week on top this season. Edged out Draft Punk, 146.26 to 142.86." },
  { week: 5, team: "Circle The Wagons", manager: "Jayson", points: 189.94,
    note: "Second-highest score of the season so far, and enough to take over 1st place. Finished ahead of Mayehem, 189.94 to 158.06." },
  { week: 4, team: "Hold the Mayo", manager: "Alex", points: 180.82,
    note: "Ended Draft Punk's three-week run on top. Edged out Lebowski Bowling Team, 180.82 to 177.58." },
  { week: 3, team: "Draft Punk", manager: "Matt", points: 159.08,
    note: "Third straight week on top, powered by a Broncos defense that closed it out with a pick-six. Edged out Whiskey Tango Foxtrot, 159.08 to 156.94." },
  { week: 2, team: "Draft Punk", manager: "Matt", points: 145.78,
    note: "Held off Yinzers by a single point (145.78 to 144.74) to keep the title." },
  { week: 1, team: "Draft Punk", manager: "Matt", points: 199.90,
    note: "Nearly doubled up Mr. Jackson if you're nasty, 199.90 to 100.26." },
];
