/**
 * Branch characters and indentation pieces used to render the tree.
 *
 * Example output these produce:
 *   ├── src          (branch)
 *   │   └── index.ts (vertical + lastBranch)
 *   └── README.md    (lastBranch)
 */
export const SYMBOLS = {
  /** Connector for an entry that has siblings after it. */
  branch: "├── ",
  /** Connector for the last entry in a directory. */
  lastBranch: "└── ",
  /** Indentation when an ancestor still has more siblings below. */
  vertical: "│   ",
  /** Indentation when an ancestor was the last of its siblings. */
  space: "    ",
};
