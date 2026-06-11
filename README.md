# Tests

Test fixtures for the **Cimba GitHub integration** — a read-only connector for
**cimba agent configuration**: reading repository files and creating Cimba agents from them.

This repository seeds the data required by the GitHub Integration PRD test cases (TC1–TC13):
agent specification files, edge-case fixtures, a non-default branch, multiple commits, and a
release tag.

## Layout

| Path | Purpose |
|---|---|
| `agents/support-bot.md` | Primary agent spec (Markdown) |
| `agents/plain-text-agent.txt` | Agent spec as plain text |
| `agents/pdf-agent.pdf` | Agent spec as PDF |
| `agents/empty-file.md` | Empty-file edge case |
| `agents/malformed.md` | Malformed-content edge case |
| `agents/multi-file/` | Multi-file agent (instructions + context + rules) |
| `configs/nested/deep/agent.md` | Deep nested path |
| `src/example.js` | Unsupported-type (code) edge case |
| `large/big-agent.md` | Oversized-file edge case (> 1 MB) |

## Topics

cimba, agent, configuration

## Test notes

Use this repo in place of `your-org/cimba-test-agents` from the PRD when running TC1-TC13.
