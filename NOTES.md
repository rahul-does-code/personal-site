# Build notes & assumptions (map branch)

- **Theme**: an enchanted hand-drawn castle map, inspired by the idea of a magical map rather than copying any film or book artwork, names or quotes. Parchment, iron-gall ink, and walking footprints.
- **Focal moment**: the map starts blank. Tap anywhere and the ink spreads outward from that point, room by room. It's skipped for reduced-motion users and for return visits in the same session, and "Fold the map away" in the footer replays it.
- **Motion that carries meaning**: Rahul's footprints wander between rooms and walk to whichever room you click. Your own footprints follow the cursor. A trail in the left margin shows how far down the page you are. The armor draws itself, ledger entries unfold, and the letter opens when you break the wax seal.
- **Suit of armor** is kept as "The Armory": a plate-armor diagram where each piece maps to a skill group in `content.js`.
- **Design references**: followed pbakaus/impeccable's craft floor. That means one authored moment instead of fading in every section, no eyebrow labels or section numbers, no hard offset shadows, themed selection, caret, scrollbar and focus rings, `text-wrap: balance`/`pretty`, and content visible if JS fails.
- **Removed** the ToyArk hero image on this branch.
- **Email / projects / copy**: still placeholders marked `TODO` in `content.js` and `index.html`.
