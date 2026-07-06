# Directory Tree Printer

A command-line tool that prints a directory as a tree, like the Unix `tree` command.

## Features
- Clean tree output with branch characters
- Depth limit with `--depth N`
- Show hidden files with `--all`, folders only with `--dirs-only`
- Skips `node_modules` and `.git` by default
- Summary of total directories and files

## Tech
Node.js, TypeScript, commander

## Install & build
```bash
npm install
npm run build
npm link        # makes the `treeprint` command available globally
```

> If you'd rather not link it globally, skip `npm link` and run the tool with
> `node dist/index.js ...` in place of `treeprint ...` below.

## Usage
```bash
treeprint                 # tree of the current directory
treeprint ./src --depth 2 # limit to 2 levels
treeprint . --dirs-only   # folders only
treeprint . --all         # include hidden files
```
