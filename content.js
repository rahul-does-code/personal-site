/* =====================================================================
   CONTENT FILE — edit this to update the site. No build step needed.
   Everything marked TODO is placeholder copy for you to swap out.
   ===================================================================== */

window.SITE = {
  name: "RAHUL",
  handle: "rahul-does-code",
  github: "https://github.com/rahul-does-code",
  email: "hello@rahuldoescode.tech", // TODO: set up forwarding or swap in your real address
  socials: [
    { label: "GitHub", url: "https://github.com/rahul-does-code" },
    { label: "LinkedIn", url: "#" }, // TODO
    { label: "Resume", url: "#" },   // TODO: drop a PDF in /assets and link it
  ],

  /* ---------- PROJECTS: each one is its own "universe" ---------- */
  projects: [
    {
      title: "Project Alpha",          // TODO
      earth: "EARTH-0001",
      tag: "Flagship",
      sfx: "KRAKOOM!",
      blurb: "Swap this with a one-paragraph pitch: what it does, why you built it, and the hardest problem you solved along the way.",
      stack: ["TypeScript", "React", "Node"],
      links: [
        { label: "Live", url: "#" },
        { label: "Code", url: "https://github.com/rahul-does-code" },
      ],
    },
    {
      title: "Project Beta",           // TODO
      earth: "EARTH-0042",
      tag: "AI / ML",
      sfx: "BZZRT!",
      blurb: "A placeholder for something smart. Mention the model, the data, and one number that shows it worked.",
      stack: ["Python", "PyTorch", "FastAPI"],
      links: [{ label: "Code", url: "https://github.com/rahul-does-code" }],
    },
    {
      title: "Project Gamma",          // TODO
      earth: "EARTH-0404",
      tag: "Hardware",
      sfx: "FZZT!",
      blurb: "Got a project with wires, sensors, or a soldering iron? It goes here. Photos make these hit way harder.",
      stack: ["C++", "Arduino", "3D Print"],
      links: [{ label: "Writeup", url: "#" }],
    },
    {
      title: "Project Delta",          // TODO
      earth: "EARTH-1337",
      tag: "Tooling",
      sfx: "SHNK!",
      blurb: "The little dev tool or CLI you built because you were annoyed. Those are the ones people actually want to hear about.",
      stack: ["Go", "CLI", "Docker"],
      links: [{ label: "Code", url: "https://github.com/rahul-does-code" }],
    },
    {
      title: "Project Epsilon",        // TODO
      earth: "EARTH-2077",
      tag: "Game",
      sfx: "BWAAM!",
      blurb: "Game jam entry, weekend hack, or experimental toy. Link a playable build if you can.",
      stack: ["Godot", "GDScript"],
      links: [{ label: "Play", url: "#" }],
    },
    {
      title: "Project Zeta",           // TODO
      earth: "EARTH-8008",
      tag: "Web",
      sfx: "WHAM!",
      blurb: "Something shipped to real users. Mention how many and what you learned from them.",
      stack: ["Next.js", "Postgres", "Tailwind"],
      links: [{ label: "Live", url: "#" }],
    },
  ],

  /* ---------- THE SUIT: your armor, piece by piece ----------
     Each part maps to a piece of the armor diagram.
     level is 0–100 and drives the power bar. */
  suit: {
    designation: "MK-VII // RDC-ARMOR",
    parts: {
      helmet: {
        name: "Neural Helm",
        slot: "HEAD",
        role: "Languages: how I think",
        gear: [
          { name: "TypeScript", level: 90 },
          { name: "Python", level: 85 },
          { name: "Go", level: 65 },
          { name: "C++", level: 55 },
        ],
      },
      core: {
        name: "Reactor Core",
        slot: "CHEST",
        role: "Frameworks: what powers the build",
        gear: [
          { name: "React / Next.js", level: 90 },
          { name: "Node / Express", level: 80 },
          { name: "FastAPI", level: 70 },
          { name: "PyTorch", level: 60 },
        ],
      },
      gauntlets: {
        name: "Fabricator Gauntlets",
        slot: "ARMS",
        role: "Tools: what I build with",
        gear: [
          { name: "Git", level: 90 },
          { name: "Figma", level: 70 },
          { name: "Neovim / VS Code", level: 85 },
          { name: "Testing (Vitest, Pytest)", level: 70 },
        ],
      },
      belt: {
        name: "Utility Rig",
        slot: "WAIST",
        role: "Data: what I store and query",
        gear: [
          { name: "PostgreSQL", level: 80 },
          { name: "Redis", level: 60 },
          { name: "SQLite", level: 75 },
        ],
      },
      boots: {
        name: "Deploy Boots",
        slot: "LEGS",
        role: "Infra: how it ships",
        gear: [
          { name: "Docker", level: 80 },
          { name: "GitHub Actions", level: 80 },
          { name: "AWS / Vercel", level: 65 },
          { name: "Linux", level: 85 },
        ],
      },
    },
  },

  /* ---------- THE LAB: cool stuff, odds and ends ---------- */
  lab: [
    { kicker: "CURRENTLY", title: "Building this site", body: "Halftones, misregistered ink, and animation that runs on twos. Yes, the stutter is on purpose." },
    { kicker: "LEARNING", title: "Something new", body: "TODO: whatever you're deep in right now, like Rust, shaders, or ML papers." },
    { kicker: "READING", title: "A good book", body: "TODO: book or blog you'd recommend to anyone who asks." },
    { kicker: "ON REPEAT", title: "Coding playlist", body: "TODO: link the playlist that gets you through a 2am debugging session." },
    { kicker: "WINS", title: "Hackathons & awards", body: "TODO: placements, certs, shout-outs. Brag a little, it's your site." },
    { kicker: "SIDE QUEST", title: "Off the keyboard", body: "TODO: the non-code thing you're into. People remember this part." },
  ],
};
