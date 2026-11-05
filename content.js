/* =====================================================================
   CONTENT FILE — edit this to update the site. No build step needed.
   Everything marked TODO is placeholder copy for you to swap out.
   ===================================================================== */

window.SITE = {
  name: "Rahul",
  github: "https://github.com/rahul-does-code",
  email: "hello@rahuldoescode.tech", // TODO: set up forwarding or swap in your real address
  socials: [
    { label: "GitHub", url: "https://github.com/rahul-does-code" },
    { label: "LinkedIn", url: "#" }, // TODO
    { label: "Résumé", url: "#" },   // TODO: drop a PDF in /assets and link it
  ],

  /* ---------- THE WORKSHOP: projects, written like ledger entries ---------- */
  projects: [
    {
      title: "Project Alpha",          // TODO
      year: "2026",
      kind: "Flagship",
      blurb: "Swap this with a one-paragraph pitch: what it does, why you built it, and the hardest problem you solved along the way.",
      detail: "Room for the longer story: the architecture, the dead ends, what you'd change next time. Opens when someone unfolds the entry.",
      stack: ["TypeScript", "React", "Node"],
      links: [
        { label: "Visit", url: "#" },
        { label: "Source", url: "https://github.com/rahul-does-code" },
      ],
    },
    {
      title: "Project Beta",           // TODO
      year: "2025",
      kind: "Machine learning",
      blurb: "A placeholder for something smart. Mention the model, the data, and one number that shows it worked.",
      detail: "Which dataset, how you evaluated it, and what surprised you.",
      stack: ["Python", "PyTorch", "FastAPI"],
      links: [{ label: "Source", url: "https://github.com/rahul-does-code" }],
    },
    {
      title: "Project Gamma",          // TODO
      year: "2025",
      kind: "Hardware",
      blurb: "Got a project with wires, sensors, or a soldering iron? It goes here. Photos make these land.",
      detail: "Parts list, the bug that took a week, and a link to the build log.",
      stack: ["C++", "Arduino", "3D printing"],
      links: [{ label: "Write-up", url: "#" }],
    },
    {
      title: "Project Delta",          // TODO
      year: "2024",
      kind: "Tooling",
      blurb: "The little dev tool or CLI you built because something annoyed you. Those are the ones people actually want to hear about.",
      detail: "Who uses it, and the one feature you're proudest of.",
      stack: ["Go", "CLI", "Docker"],
      links: [{ label: "Source", url: "https://github.com/rahul-does-code" }],
    },
    {
      title: "Project Epsilon",        // TODO
      year: "2024",
      kind: "Game",
      blurb: "Game jam entry, weekend hack, or experimental toy. Link a playable build if you can.",
      detail: "The theme, the time limit, and how it placed.",
      stack: ["Godot", "GDScript"],
      links: [{ label: "Play", url: "#" }],
    },
  ],

  /* ---------- THE ARMORY: a suit of armor, piece by piece ----------
     level is 0–100 and fills the ink gauge. */
  suit: {
    parts: {
      helm: {
        name: "The Helm",
        role: "Languages: how I think",
        gear: [
          { name: "TypeScript", level: 90 },
          { name: "Python", level: 85 },
          { name: "Go", level: 65 },
          { name: "C++", level: 55 },
        ],
      },
      breastplate: {
        name: "The Breastplate",
        role: "Frameworks: the core of every build",
        gear: [
          { name: "React / Next.js", level: 90 },
          { name: "Node / Express", level: 80 },
          { name: "FastAPI", level: 70 },
          { name: "PyTorch", level: 60 },
        ],
      },
      gauntlets: {
        name: "The Gauntlets",
        role: "Tools: what I build with",
        gear: [
          { name: "Git", level: 90 },
          { name: "Neovim / VS Code", level: 85 },
          { name: "Figma", level: 70 },
          { name: "Testing (Vitest, Pytest)", level: 70 },
        ],
      },
      belt: {
        name: "The Sword Belt",
        role: "Data: what I store and query",
        gear: [
          { name: "PostgreSQL", level: 80 },
          { name: "SQLite", level: 75 },
          { name: "Redis", level: 60 },
        ],
      },
      greaves: {
        name: "The Greaves",
        role: "Infrastructure: how it ships",
        gear: [
          { name: "Linux", level: 85 },
          { name: "Docker", level: 80 },
          { name: "GitHub Actions", level: 80 },
          { name: "AWS / Vercel", level: 65 },
        ],
      },
    },
  },

  /* ---------- THE CABINET: cool stuff, odds and ends ---------- */
  cabinet: [
    { title: "Building this site", tag: "Currently", body: "A map that draws itself and footsteps that wander between rooms. Everything here is hand-written HTML, CSS and JavaScript." },
    { title: "Something new", tag: "Learning", body: "TODO: whatever you're deep in right now, like Rust, shaders, or ML papers." },
    { title: "A good book", tag: "Reading", body: "TODO: a book or blog you'd recommend to anyone who asks." },
    { title: "Hackathons & awards", tag: "Wins", body: "TODO: placements, certificates, shout-outs. Brag a little; it's your site." },
    { title: "Off the keyboard", tag: "Side quest", body: "TODO: the non-code thing you're into. People remember this part." },
  ],
};
