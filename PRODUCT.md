# Diff Checker — Product brief

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Repository evidence suggests developers, writers, and reviewers comparing two
plain-text versions before deciding what changed.

## Product Purpose

Compare two text inputs line by line and make additions, removals, and shared
lines immediately legible.

## Positioning

The product turns a small local comparison into a readable review surface
without requiring a repository connection, account, or upload.

## Operating Context

The user pastes an original and a modified version, scans the change counts,
then reads the marked output to verify what was added or removed.

## Capabilities and Constraints

- LCS-style line diff with equal, added, and deleted operations.
- Live stats for additions, deletions, and shared lines.
- Character/word modes, repository integrations, and large-file guarantees are
  not claimed.

## Brand Commitments

The product is part of the Bookchaowalit developer-tools portfolio and should
remain local-first and precise about line-level comparison.

## Evidence on Hand

- `README.md` states the feature and limits.
- `app/page.tsx` contains the comparison algorithm and rendered result.
- No external repository connection or customer proof is claimed.

## Product Principles

- Show the source and result in the same visual frame.
- Let change markers carry meaning without relying on color alone.
- Keep comparison feedback immediate and honest.

## Accessibility & Inclusion

Use labeled textareas, semantic diff markers, readable line numbers or signs,
keyboard focus, and text labels alongside color-coded changes.
