import { useState } from "react";
import { API_URL } from "../config";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { Play, Send, Check, X, Loader2 } from "lucide-react";

const DEFAULT_CODE = `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello World!";
    return 0;
}`;

function Compiler(props) {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState("");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const testcases = props.problem?.testcases || props.testcases || [];

  const handleRun = async () => {
    setRunning(true);
    setVerdict("");
    const payload = { language: "cpp", code, input: input || "" };
    try {
      const { data } = await axios.post(`${API_URL}/run`, payload);
      setOutput(String(data));
    } catch (err) {
      setOutput(err?.response?.data?.message?.stderr || "An error occurred while running your code.");
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (testcases.length === 0) {
      setVerdict("NoTests");
      return;
    }
    setSubmitting(true);
    setVerdict("");
    let allCorrect = true;

    for (let i = 0; i < testcases.length; i++) {
      const testcase = testcases[i];
      const payload = { language: "cpp", code, input: testcase.input };
      try {
        const { data } = await axios.post(`${API_URL}/run`, payload);
        if (String(data).trim() !== String(testcase.output).trim()) {
          allCorrect = false;
          break;
        }
      } catch (err) {
        console.log(err);
        allCorrect = false;
        break;
      }
    }

    setVerdict(allCorrect ? "Correct" : "Incorrect");
    setSubmitting(false);
  };

  return (
    <div>
      {/* Editor frame */}
      <div className="border border-neutral-300 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2.5">
          <span className="font-mono text-xs text-neutral-500">main.cpp</span>
          <span className="font-mono text-[10px] uppercase tracking-label text-neutral-400">
            C++
          </span>
        </div>
        <Editor
          height="380px"
          language="cpp"
          theme="vs"
          value={code}
          onChange={(value) => setCode(value ?? "")}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            smoothScrolling: true,
            renderLineHighlight: "none",
          }}
        />
      </div>

      {/* Custom input */}
      <div className="mt-4">
        <label className="field-label">Custom input</label>
        <textarea
          className="field h-24 resize-y font-mono"
          placeholder="stdin for the Run button…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={handleRun} disabled={running} className="btn-secondary disabled:opacity-50">
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {running ? "Running…" : "Run"}
        </button>
        <button onClick={handleSubmit} disabled={submitting} className="btn-primary disabled:opacity-50">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {submitting ? "Judging…" : "Submit"}
        </button>
      </div>

      {/* Verdict */}
      {verdict === "Correct" && (
        <div className="mt-5 flex items-center gap-3 border border-black bg-black px-4 py-3 text-white animate-fade-up">
          <Check className="h-4 w-4" />
          <span className="font-mono text-xs uppercase tracking-label">Accepted</span>
        </div>
      )}
      {verdict === "Incorrect" && (
        <div className="mt-5 flex items-center gap-3 border border-signal bg-signal px-4 py-3 text-white animate-fade-up">
          <X className="h-4 w-4" />
          <span className="font-mono text-xs uppercase tracking-label">Wrong Answer</span>
        </div>
      )}
      {verdict === "NoTests" && (
        <div className="mt-5 border border-neutral-300 px-4 py-3 font-mono text-xs uppercase tracking-label text-neutral-500 animate-fade-up">
          No test cases available for this problem.
        </div>
      )}

      {/* Output */}
      {output !== "" && (
        <div className="mt-5 border border-neutral-300 bg-white animate-fade-up">
          <div className="border-b border-neutral-200 px-4 py-2.5">
            <span className="font-mono text-[10px] uppercase tracking-label text-neutral-400">
              Output
            </span>
          </div>
          <pre className="overflow-x-auto px-4 py-4 font-mono text-sm leading-relaxed text-neutral-800">
            {String(output)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Compiler;
