import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { Plus, Trash2 } from "lucide-react";

const AddProblem = () => {
  const [problem, setProblem] = useState({
    title: "",
    desc: "",
    statement: "",
    input: "",
    output: "",
    constraints: "",
    testcase: [{ input: "", output: "", sample: false, explanation: "" }],
    createdBy: "admin",
  });

  const handleChange = (e) => {
    setProblem({ ...problem, [e.target.name]: e.target.value });
  };

  const handleTestcaseChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedTestCases = problem.testcase.map((test, i) =>
      i === index
        ? { ...test, [name]: type === "checkbox" ? checked : value }
        : test
    );
    setProblem({ ...problem, testcase: updatedTestCases });
  };

  const addTestcase = () => {
    setProblem({
      ...problem,
      testcase: [
        ...problem.testcase,
        { input: "", output: "", sample: false, explanation: "" },
      ],
    });
  };

  const removeTestcase = (index) => {
    if (problem.testcase.length === 1) return;
    setProblem({
      ...problem,
      testcase: problem.testcase.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/problem/add`, problem);
      alert("Problem added successfully!");
    } catch (err) {
      console.error(err);
      alert("Error adding problem");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="shell max-w-3xl py-16">
        <span className="label">Admin</span>
        <h1 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight text-black md:text-5xl">
          New problem
        </h1>

        <form onSubmit={handleSubmit} className="mt-12 space-y-8">
          <div>
            <label className="field-label">Title</label>
            <input
              type="text"
              name="title"
              value={problem.title}
              onChange={handleChange}
              required
              className="field"
            />
          </div>

          <div>
            <label className="field-label">Description</label>
            <textarea
              name="desc"
              value={problem.desc}
              onChange={handleChange}
              rows={2}
              className="field resize-y"
            />
          </div>

          <div>
            <label className="field-label">Statement</label>
            <textarea
              name="statement"
              value={problem.statement}
              onChange={handleChange}
              required
              rows={5}
              className="field resize-y"
            />
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <label className="field-label">Input</label>
              <textarea
                name="input"
                value={problem.input}
                onChange={handleChange}
                rows={3}
                className="field resize-y font-mono"
              />
            </div>
            <div>
              <label className="field-label">Output</label>
              <textarea
                name="output"
                value={problem.output}
                onChange={handleChange}
                rows={3}
                className="field resize-y font-mono"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Constraints</label>
            <textarea
              name="constraints"
              value={problem.constraints}
              onChange={handleChange}
              rows={2}
              className="field resize-y font-mono"
            />
          </div>

          {/* Test cases */}
          <div className="rule pt-8">
            <div className="flex items-center justify-between">
              <span className="label">Test cases</span>
              <button type="button" onClick={addTestcase} className="btn gap-1.5 text-xs uppercase tracking-label text-neutral-500 hover:text-black">
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {problem.testcase.map((testcase, index) => (
                <div key={index} className="border border-neutral-200 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-xs text-neutral-400">
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTestcase(index)}
                      className="text-neutral-400 transition-colors hover:text-signal disabled:opacity-30"
                      disabled={problem.testcase.length === 1}
                      aria-label="Remove test case"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="field-label">Input</label>
                      <textarea
                        name="input"
                        value={testcase.input}
                        onChange={(e) => handleTestcaseChange(index, e)}
                        rows={3}
                        className="field resize-y font-mono"
                      />
                    </div>
                    <div>
                      <label className="field-label">Output</label>
                      <textarea
                        name="output"
                        value={testcase.output}
                        onChange={(e) => handleTestcaseChange(index, e)}
                        rows={3}
                        className="field resize-y font-mono"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="field-label">Explanation</label>
                    <textarea
                      name="explanation"
                      value={testcase.explanation}
                      onChange={(e) => handleTestcaseChange(index, e)}
                      rows={2}
                      className="field resize-y"
                    />
                  </div>

                  <label className="mt-4 flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      name="sample"
                      checked={testcase.sample}
                      onChange={(e) => handleTestcaseChange(index, e)}
                      className="h-4 w-4 accent-signal"
                    />
                    <span className="font-mono text-xs uppercase tracking-label text-neutral-500">
                      Sample test case
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            Submit problem
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProblem;
