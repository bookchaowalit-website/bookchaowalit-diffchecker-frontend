"use client";

import { useState, useEffect } from "react";
import { FileText, BarChart3, RefreshCw } from "lucide-react";

interface DiffResult {
  mode: string;
  differences: any[];
  summary: any;
}

interface DiffStats {
  text1: any;
  text2: any;
  comparison: any;
}

export default function Home() {
  const [text1, setText1] = useState("Hello World\nThis is the first text.");
  const [text2, setText2] = useState("Hello World\nThis is the second text.");
  const [diff, setDiff] = useState<DiffResult | null>(null);
  const [stats, setStats] = useState<DiffStats | null>(null);
  const [mode, setMode] = useState("word");
  const [isLoading, setIsLoading] = useState(false);

  const compare = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/mcp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method: "tools/call",
          params: {
            name: "diff_compare",
            arguments: {
              text1,
              text2,
              mode
            }
          }
        }),
      });

      const data = await response.json();
      if (!data.error) {
        setDiff(data.result);
      }
    } catch (error) {
      console.error("Diff failed");
    } finally {
      setIsLoading(false);
    }
  };

  const getStats = async () => {
    try {
      const response = await fetch("/api/mcp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method: "tools/call",
          params: {
            name: "diff_statistics",
            arguments: {
              text1,
              text2
            }
          }
        }),
      });

      const data = await response.json();
      if (!data.error) {
        setStats(data.result);
      }
    } catch (error) {
      console.error("Stats failed");
    }
  };

  useEffect(() => {
    compare();
    getStats();
  }, [text1, text2, mode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Diff Checker
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Compare texts and find differences
          </p>
        </header>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Text Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Text 1
              </label>
              <textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                className="w-full h-64 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-900 dark:border-slate-600 dark:text-white font-mono text-sm resize-none"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Text 2
              </label>
              <textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                className="w-full h-64 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-900 dark:border-slate-600 dark:text-white font-mono text-sm resize-none"
              />
            </div>
          </div>

          {/* Mode Selection */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Comparison Mode
              </h2>
              <button
                onClick={() => {
                  setText1("");
                  setText2("");
                }}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Clear
              </button>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setMode("word")}
                className={`px-4 py-2 rounded ${
                  mode === "word"
                    ? "bg-blue-500 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                }`}
              >
                Word Level
              </button>
              <button
                onClick={() => setMode("line")}
                className={`px-4 py-2 rounded ${
                  mode === "line"
                    ? "bg-blue-500 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                }`}
              >
                Line Level
              </button>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Text 1</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Lines: {stats.text1.lines}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Words: {stats.text1.words}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Characters: {stats.text1.characters}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Text 2</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Lines: {stats.text2.lines}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Words: {stats.text2.words}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Characters: {stats.text2.characters}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Comparison</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Similarity: {stats.comparison.similarity.line.toFixed(1)}%
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Added: {stats.comparison.differences.added}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Removed: {stats.comparison.differences.removed}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Diff Results */}
          {diff && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Differences ({diff.mode} level)
              </h2>

              <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-700 rounded">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <span className="text-green-600 dark:text-green-400">
                    Added: {diff.summary.added}
                  </span>
                  <span className="text-red-600 dark:text-red-400">
                    Removed: {diff.summary.removed}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Unchanged: {diff.summary.unchanged}
                  </span>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto border border-slate-200 dark:border-slate-600 rounded">
                {diff.differences.map((diffItem, index) => (
                  <div
                    key={index}
                    className={`p-3 border-b border-slate-200 dark:border-slate-600 ${
                      diffItem.type === 'added' ? 'bg-green-50 dark:bg-green-900/20' :
                      diffItem.type === 'removed' ? 'bg-red-50 dark:bg-red-900/20' :
                      diffItem.type === 'modified' ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${
                        diffItem.type === 'added' ? 'text-green-600 dark:text-green-400' :
                        diffItem.type === 'removed' ? 'text-red-600 dark:text-red-400' :
                        'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {diffItem.type === 'added' ? '+' :
                         diffItem.type === 'removed' ? '-' : '~'}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {diffItem.mode === 'line' ? 'Line' : 'Word'}
                        {diffItem.line !== undefined ? ` ${diffItem.line + 1}` :
                         ` ${diffItem.position}`}
                      </span>
                    </div>
                    <div className="font-mono text-sm">
                      {diffItem.type === 'modified' ? (
                        <div>
                          <div className="text-red-600 dark:text-red-400">
                            - {diffItem.oldContent}
                          </div>
                          <div className="text-green-600 dark:text-green-400">
                            + {diffItem.newContent}
                          </div>
                        </div>
                      ) : (
                        <div>
                          {diffItem.type === 'removed' ? (
                            <span className="text-red-600 dark:text-red-400">- {diffItem.content}</span>
                          ) : (
                            <span className="text-green-600 dark:text-green-400">+ {diffItem.content}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
