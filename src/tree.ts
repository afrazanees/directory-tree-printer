import fs from "fs";
import path from "path";
import { SYMBOLS } from "./format";

export interface TreeOptions {
  /** Include hidden entries (names starting with a dot). */
  all: boolean;
  /** Only list directories, omit files. */
  dirsOnly: boolean;
  /** Maximum levels of descendants to print. Use Infinity for no limit. */
  depth: number;
}

export interface TreeResult {
  /** Rendered tree lines (without the root label). */
  lines: string[];
  /** Number of directories printed. */
  dirCount: number;
  /** Number of files printed. */
  fileCount: number;
}

/** Directory names that are skipped by default to keep output readable. */
const DEFAULT_SKIP = new Set(["node_modules", ".git"]);

/**
 * Walk `root` and build the tree lines plus directory/file counts.
 */
export function buildTree(root: string, options: TreeOptions): TreeResult {
  const counts = { dirs: 0, files: 0 };
  const lines: string[] = [];
  walk(root, "", options.depth, options, counts, lines);
  return { lines, dirCount: counts.dirs, fileCount: counts.files };
}

function walk(
  dir: string,
  prefix: string,
  depthRemaining: number,
  options: TreeOptions,
  counts: { dirs: number; files: number },
  lines: string[]
): void {
  if (depthRemaining < 1) {
    return;
  }

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    lines.push(`${prefix}${SYMBOLS.lastBranch}[unable to read directory]`);
    return;
  }

  const visible = entries
    .filter((entry) => {
      if (DEFAULT_SKIP.has(entry.name)) return false;
      if (!options.all && entry.name.startsWith(".")) return false;
      if (options.dirsOnly && !entry.isDirectory()) return false;
      return true;
    })
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

  visible.forEach((entry, index) => {
    const isLast = index === visible.length - 1;
    const connector = isLast ? SYMBOLS.lastBranch : SYMBOLS.branch;
    lines.push(`${prefix}${connector}${entry.name}`);

    if (entry.isDirectory()) {
      counts.dirs++;
      const childPrefix = prefix + (isLast ? SYMBOLS.space : SYMBOLS.vertical);
      walk(
        path.join(dir, entry.name),
        childPrefix,
        depthRemaining - 1,
        options,
        counts,
        lines
      );
    } else {
      counts.files++;
    }
  });
}
