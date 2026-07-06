#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { Command } from "commander";
import { buildTree, TreeOptions } from "./tree";

interface CliOptions {
  depth?: number;
  all?: boolean;
  dirsOnly?: boolean;
}

const program = new Command();

program
  .name("treeprint")
  .description("Print a directory as a tree, similar to the Unix `tree` command.")
  .argument("[dir]", "directory to print", ".")
  .option("-d, --depth <n>", "limit how many levels deep to print", parseDepth)
  .option("-a, --all", "include hidden files (those starting with a dot)")
  .option("--dirs-only", "show directories only")
  .action((dir: string, opts: CliOptions) => {
    run(dir, opts);
  });

program.parse();

function parseDepth(value: string): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) {
    console.error(`Error: --depth must be a positive integer (got "${value}").`);
    process.exit(1);
  }
  return n;
}

function run(dir: string, opts: CliOptions): void {
  const target = path.resolve(dir);

  let stat: fs.Stats;
  try {
    stat = fs.statSync(target);
  } catch {
    console.error(`Error: path not found: ${dir}`);
    process.exit(1);
  }

  if (!stat.isDirectory()) {
    console.error(`Error: not a directory: ${dir}`);
    process.exit(1);
  }

  const options: TreeOptions = {
    all: Boolean(opts.all),
    dirsOnly: Boolean(opts.dirsOnly),
    depth: opts.depth ?? Infinity,
  };

  const { lines, dirCount, fileCount } = buildTree(target, options);

  console.log(dir);
  for (const line of lines) {
    console.log(line);
  }

  const dirLabel = dirCount === 1 ? "directory" : "directories";
  const fileLabel = fileCount === 1 ? "file" : "files";
  const summary = options.dirsOnly
    ? `${dirCount} ${dirLabel}`
    : `${dirCount} ${dirLabel}, ${fileCount} ${fileLabel}`;

  console.log(`\n${summary}`);
}
