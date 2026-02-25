import { NextRequest, NextResponse } from 'next/server';

interface MCPRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: {
    name?: string;
    arguments?: any;
  };
}

interface MCPResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

const initialized = false;
const tools = [
  {
    name: "diff_compare",
    description: "Compare two texts and show differences",
    inputSchema: {
      type: "object",
      properties: {
        text1: {
          type: "string",
          description: "First text to compare"
        },
        text2: {
          type: "string",
          description: "Second text to compare"
        },
        mode: {
          type: "string",
          description: "Comparison mode: word, char, or line",
          default: "word"
        }
      },
      required: ["text1", "text2"]
    }
  },
  {
    name: "diff_statistics",
    description: "Get statistics about text differences",
    inputSchema: {
      type: "object",
      properties: {
        text1: {
          type: "string",
          description: "First text"
        },
        text2: {
          type: "string",
          description: "Second text"
        }
      },
      required: ["text1", "text2"]
    }
  }
];

export async function POST(request: NextRequest) {
  let requestId: number | string = 0;

  try {
    const body: MCPRequest = await request.json();
    requestId = body.id;

    if (body.jsonrpc !== "2.0") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: requestId,
        error: {
          code: -32600,
          message: "Invalid Request"
        }
      } as MCPResponse, { status: 400 });
    }

    const response: MCPResponse = {
      jsonrpc: "2.0",
      id: requestId
    };

    switch (body.method) {
      case "initialize":
        response.result = {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {}
          }
        };
        break;

      case "tools/list":
        response.result = { tools };
        break;

      case "tools/call":
        const params = body.params;
        const toolName = params?.name;
        const args = params?.arguments;

        if (!args) {
          response.error = {
            code: -32602,
            message: "Invalid params: arguments required"
          };
          break;
        }

        try {
          switch (toolName) {
            case "diff_compare":
              const diff = generateDiff(args.text1, args.text2, args.mode || "word");
              response.result = diff;
              break;

            case "diff_statistics":
              const stats = calculateStats(args.text1, args.text2);
              response.result = stats;
              break;

            default:
              response.error = {
                code: -32601,
                message: `Unknown tool: ${toolName}`
              };
          }
        } catch (error) {
          response.error = {
            code: -32603,
            message: "Internal error"
          };
        }
        break;

      default:
        response.error = {
          code: -32601,
          message: `Method not found: ${body.method}`
        };
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      jsonrpc: "2.0",
      id: 0,
      error: {
        code: -32603,
        message: "Internal error"
      }
    } as MCPResponse, { status: 500 });
  }
}

function generateDiff(text1: string, text2: string, mode: string): any {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');

  if (mode === "line") {
    const diff = computeLineDiff(lines1, lines2);
    return {
      mode: "line",
      text1: text1,
      text2: text2,
      differences: diff,
      summary: {
        totalLines: Math.max(lines1.length, lines2.length),
        added: diff.filter(d => d.type === 'added').length,
        removed: diff.filter(d => d.type === 'removed').length,
        unchanged: diff.filter(d => d.type === 'unchanged').length
      }
    };
  } else {
    const diff1 = text1.split(/\s+/);
    const diff2 = text2.split(/\s+/);
    const wordDiff = computeWordDiff(diff1, diff2);

    return {
      mode: "word",
      text1: text1,
      text2: text2,
      differences: wordDiff,
      summary: {
        totalWords: Math.max(diff1.length, diff2.length),
        added: wordDiff.filter(d => d.type === 'added').length,
        removed: wordDiff.filter(d => d.type === 'removed').length,
        unchanged: wordDiff.filter(d => d.type === 'unchanged').length
      }
    };
  }
}

function computeLineDiff(lines1: string[], lines2: string[]): any[] {
  const result: any[] = [];
  const maxLines = Math.max(lines1.length, lines2.length);

  for (let i = 0; i < maxLines; i++) {
    if (i < lines1.length && i < lines2.length) {
      if (lines1[i] === lines2[i]) {
        result.push({ type: 'unchanged', line: i, content: lines1[i] });
      } else {
        result.push({
          type: 'modified',
          line: i,
          oldContent: lines1[i],
          newContent: lines2[i]
        });
      }
    } else if (i < lines1.length) {
      result.push({ type: 'removed', line: i, content: lines1[i] });
    } else {
      result.push({ type: 'added', line: i, content: lines2[i] });
    }
  }

  return result;
}

function computeWordDiff(words1: string[], words2: string[]): any[] {
  const result: any[] = [];
  const maxWords = Math.max(words1.length, words2.length);

  for (let i = 0; i < maxWords; i++) {
    if (i < words1.length && i < words2.length) {
      if (words1[i] === words2[i]) {
        result.push({ type: 'unchanged', position: i, content: words1[i] });
      } else {
        result.push({
          type: 'modified',
          position: i,
          oldContent: words1[i],
          newContent: words2[i]
        });
      }
    } else if (i < words1.length) {
      result.push({ type: 'removed', position: i, content: words1[i] });
    } else {
      result.push({ type: 'added', position: i, content: words2[i] });
    }
  }

  return result;
}

function calculateStats(text1: string, text2: string): any {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const words1 = text1.split(/\s+/);
  const words2 = text2.split(/\s+/);
  const chars1 = text1.length;
  const chars2 = text2.length;

  const similarLines = lines1.filter(line => lines2.includes(line)).length;
  const similarWords = words1.filter(word => words2.includes(word)).length;

  return {
    text1: {
      lines: lines1.length,
      words: words1.length,
      characters: chars1
    },
    text2: {
      lines: lines2.length,
      words: words2.length,
      characters: chars2
    },
    comparison: {
      similarity: {
        line: (similarLines / Math.max(lines1.length, lines2.length)) * 100,
        word: (similarWords / Math.max(words1.length, words2.length)) * 100,
        character: ((chars1 + chars2 - Math.abs(chars1 - chars2)) / Math.max(chars1, chars2)) * 100
      },
      differences: {
        lines: Math.abs(lines1.length - lines2.length),
        words: Math.abs(words1.length - words2.length),
        characters: Math.abs(chars1 - chars2)
      }
    }
  };
}