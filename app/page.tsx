"use client";

import { useState, useMemo, type ReactNode } from "react";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function Shell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Client-side utility · no server required
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        </header>
        {children}
        <footer className="mt-10 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
          Data stays in your browser. Part of the Bookchaowalit developer tools portfolio.
        </footer>
      </div>
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      : variant === "secondary"
        ? "bg-white text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700 dark:hover:bg-zinc-800"
        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900";
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-zinc-500">{hint}</span> : null}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";
const areaClass = `${inputClass} min-h-[160px] resize-y`;

type Op = { type: "equal" | "add" | "del"; line: string };

function lineDiff(a: string, b: string): Op[] {
  const A = a.split("\n");
  const B = b.split("\n");
  const n = A.length;
  const m = B.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ops: Op[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) {
      ops.push({ type: "equal", line: A[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: "del", line: A[i] });
      i++;
    } else {
      ops.push({ type: "add", line: B[j] });
      j++;
    }
  }
  while (i < n) ops.push({ type: "del", line: A[i++] });
  while (j < m) ops.push({ type: "add", line: B[j++] });
  return ops;
}

export default function Home() {
  const [left, setLeft] = useState("Hello World\nThis is the first text.\nShared line");
  const [right, setRight] = useState("Hello World\nThis is the second text.\nShared line\nExtra");
  const ops = useMemo(() => lineDiff(left, right), [left, right]);
  const stats = useMemo(() => {
    return {
      add: ops.filter((o) => o.type === "add").length,
      del: ops.filter((o) => o.type === "del").length,
      equal: ops.filter((o) => o.type === "equal").length,
    };
  }, [ops]);

  return (
    <Shell title="Diff Checker" subtitle="Paste two versions of a file or snippet and see line-level additions and removals.">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Original">
          <textarea className={areaClass} value={left} onChange={(e) => setLeft(e.target.value)} />
        </Field>
        <Field label="Modified">
          <textarea className={areaClass} value={right} onChange={(e) => setRight(e.target.value)} />
        </Field>
      </div>
      <div className="mt-4 flex gap-3 text-sm">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
          +{stats.add}
        </span>
        <span className="rounded-full bg-red-100 px-3 py-1 text-red-800 dark:bg-red-900/40 dark:text-red-200">
          −{stats.del}
        </span>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
          ={stats.equal}
        </span>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <pre className="max-h-[480px] overflow-auto bg-white p-0 text-sm dark:bg-zinc-950">
          {ops.map((op, idx) => (
            <div
              key={idx}
              className={
                op.type === "add"
                  ? "bg-emerald-50 px-3 py-0.5 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100"
                  : op.type === "del"
                    ? "bg-red-50 px-3 py-0.5 text-red-900 dark:bg-red-950/50 dark:text-red-100"
                    : "px-3 py-0.5 text-zinc-700 dark:text-zinc-300"
              }
            >
              <span className="mr-2 inline-block w-4 select-none opacity-60">
                {op.type === "add" ? "+" : op.type === "del" ? "−" : " "}
              </span>
              {op.line || " "}
            </div>
          ))}
        </pre>
      </div>
    </Shell>
  );
}
