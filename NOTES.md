# Build notes & assumptions (map branch)

- **Theme (v2, from Rahul's reference images)**: a tri-fold parchment map. It opens from a castle cover when you click "I solemnly swear that I am up to no good" and folds shut again with "Mischief managed". Walls are double lines with tiny lettering between them, rulers and Latin bands run along the edges, and named footsteps walk the floor plan.
- **Not copied**: none of the film or book artwork, crest, place names or character names are used. The presenters are "Rahul, Ctrl, Alt & Delete", the title is "The Developer's Map", and the Latin is original pun Latin. The two famous phrases are kept as button text because Rahul asked for them.
- **Motion**: the flaps unfold with 3D `rotateY` (`rotateX` stacked vertically on phones). Rahul and "A Stray Bug" wander between rooms, and your own footprints follow the pointer. Hovering a nav link sends a set of footsteps walking toward that section. Ink draws walls, the compass and the armor as they come into view. Footsteps also circle the folded cover. Reduced-motion users get instant state changes and still footsteps.
- **Suit of armor**: kept as "The Armory".
- **Design rules followed** (pbakaus/impeccable): content stays reachable while the map is folded, hidden faces are `inert`, the selection, focus and scrollbar are themed, and there are no section numbers or eyebrow labels.
- **Content**: still placeholders marked `TODO` in `content.js` and `index.html`.
