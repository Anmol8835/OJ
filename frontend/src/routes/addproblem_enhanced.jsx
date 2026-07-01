import React, { useState } from "react";
import axios from "axios";
import InputSpecBuilder from "../components/InputSpecBuilder";

const AddProblemEnhanced = () => {
  const [problem, setProblem] = useState({
    title: "",
    desc: "",
    statement: "",
    input: "",
    output: "",
    constraints: "",
    testcase: [],
    createdBy: "admin",
  });

  const [autoGenerate, setAutoGenerate] = useState(false);
  const [inputSpec, setInputSpec] = useState(null);
  const [correctSolution, setCorrectSolution] = useState("");
  const [solutionLanguage, setSolutionLanguage] = useState("cpp");
  const [numTests, setNumTests] = useState(5);
  const [numEdgeCases, setNumEdgeCases] = useState(2);
  const [previewTest, setPreviewTest] = useState(null);
  const [loading, setLoading] = useState(false);

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
    const updatedTestCases = problem.testcase.filter((_, i) => i !== index);
    setProblem({ ...problem, testcase: updatedTestCases });
  };

  const handlePreviewTestCase = async () => {
    if (!inputSpec || inputSpec.inputs.length === 0) {
      alert("Please define input specification first");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8001/api/problem/preview-test", {
        inputSpec,
        correctSolution: correctSolution || null,
        language: solutionLanguage,
        isEdgeCase: false
      });

      if (response.data.success) {
        setPreviewTest(response.data.testCase);
      }
    } catch (err) {
      console.error(err);
      alert("Error generating preview: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTestCases = async () => {
    if (!inputSpec || inputSpec.inputs.length === 0) {
      alert("Please define input specification first");
      return;
    }

    if (!correctSolution) {
      alert("Please provide correct solution code to generate test outputs");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8001/api/problem/generate-tests", {
        inputSpec,
        correctSolution,
        language: solutionLanguage,
        numTests,
        numEdgeCases
      });

      if (response.data.success) {
        setProblem({ ...problem, testcase: response.data.testCases });
        alert(`Successfully generated ${response.data.testCases.length} test cases!`);
      }
    } catch (err) {
      console.error(err);
      alert("Error generating test cases: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (autoGenerate && problem.testcase.length === 0) {
      alert("Please generate test cases before submitting");
      return;
    }

    if (!autoGenerate && problem.testcase.length === 0) {
      alert("Please add at least one test case");
      return;
    }

    try {
      const problemData = {
        ...problem,
        inputSpec: autoGenerate ? inputSpec : null,
        correctSolution: autoGenerate ? correctSolution : null,
        solutionLanguage: autoGenerate ? solutionLanguage : null
      };

      await axios.post("http://localhost:8001/api/problem/add", problemData);
      alert("Problem added successfully!");

      // Reset form
      setProblem({
        title: "",
        desc: "",
        statement: "",
        input: "",
        output: "",
        constraints: "",
        testcase: [],
        createdBy: "admin",
      });
      setInputSpec(null);
      setCorrectSolution("");
      setPreviewTest(null);
    } catch (err) {
      console.error(err);
      alert("Error adding problem: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto p-8 bg-white shadow-md rounded-md"
    >
      <h2 className="text-3xl font-bold mb-6">Add New Problem</h2>

      {/* Basic Problem Info */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={problem.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Description</label>
        <textarea
          name="desc"
          value={problem.desc}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Statement</label>
        <textarea
          name="statement"
          value={problem.statement}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Input Format</label>
        <textarea
          name="input"
          value={problem.input}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Output Format</label>
        <textarea
          name="output"
          value={problem.output}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        ></textarea>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">Constraints</label>
        <textarea
          name="constraints"
          value={problem.constraints}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        ></textarea>
      </div>

      {/* Test Case Generation Toggle */}
      <div className="mb-6 p-4 border-2 border-blue-300 rounded-md bg-blue-50">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={autoGenerate}
            onChange={(e) => setAutoGenerate(e.target.checked)}
            className="mr-3 w-5 h-5"
          />
          <label className="text-lg font-bold text-blue-900">
            Enable Auto Test Case Generation
          </label>
        </div>

        {autoGenerate && (
          <div>
            {/* Correct Solution */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Correct Solution Code
              </label>
              <textarea
                value={correctSolution}
                onChange={(e) => setCorrectSolution(e.target.value)}
                rows={10}
                placeholder="Paste your correct solution here..."
                className="w-full px-3 py-2 border rounded-md font-mono text-sm focus:outline-none focus:ring focus:border-blue-300"
              ></textarea>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Language</label>
                <select
                  value={solutionLanguage}
                  onChange={(e) => setSolutionLanguage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="cpp">C++</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Regular Tests
                </label>
                <input
                  type="number"
                  value={numTests}
                  onChange={(e) => setNumTests(parseInt(e.target.value))}
                  min={1}
                  max={20}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Edge Cases
                </label>
                <input
                  type="number"
                  value={numEdgeCases}
                  onChange={(e) => setNumEdgeCases(parseInt(e.target.value))}
                  min={0}
                  max={10}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            {/* Input Spec Builder */}
            <InputSpecBuilder
              inputSpec={inputSpec || { inputs: [] }}
              setInputSpec={setInputSpec}
              onPreview={handlePreviewTestCase}
            />

            {/* Preview Test Case */}
            {previewTest && (
              <div className="mt-4 p-4 border rounded-md bg-white">
                <h4 className="font-bold mb-2">Preview Test Case:</h4>
                <div className="mb-2">
                  <strong>Input:</strong>
                  <pre className="bg-gray-100 p-2 rounded mt-1 text-sm">
                    {previewTest.input}
                  </pre>
                </div>
                {previewTest.output && (
                  <div>
                    <strong>Output:</strong>
                    <pre className="bg-gray-100 p-2 rounded mt-1 text-sm">
                      {previewTest.output}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Generate Tests Button */}
            <button
              type="button"
              onClick={handleGenerateTestCases}
              disabled={loading}
              className="w-full mt-4 px-4 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? "Generating..." : "Generate Test Cases"}
            </button>
          </div>
        )}
      </div>

      {/* Manual Test Cases or Generated Test Cases Display */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">
          Test Cases ({problem.testcase.length})
        </h3>

        {!autoGenerate && (
          <button
            type="button"
            onClick={addTestcase}
            className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Add Manual Testcase
          </button>
        )}

        {problem.testcase.map((testcase, index) => (
          <div key={index} className="mb-4 p-4 border rounded-md bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold">Test Case {index + 1}</h4>
              {!autoGenerate && (
                <button
                  type="button"
                  onClick={() => removeTestcase(index)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="mb-2">
              <label className="block text-gray-700 font-bold">Input</label>
              <textarea
                name="input"
                value={testcase.input}
                onChange={(e) => handleTestcaseChange(index, e)}
                readOnly={autoGenerate}
                className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                rows={3}
              ></textarea>
            </div>

            <div className="mb-2">
              <label className="block text-gray-700 font-bold">Output</label>
              <textarea
                name="output"
                value={testcase.output}
                onChange={(e) => handleTestcaseChange(index, e)}
                readOnly={autoGenerate}
                className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                rows={3}
              ></textarea>
            </div>

            <div className="mb-2 flex items-center">
              <input
                type="checkbox"
                name="sample"
                checked={testcase.sample}
                onChange={(e) => handleTestcaseChange(index, e)}
                className="mr-2"
              />
              <label className="text-gray-700 font-bold">Sample Test Case</label>
            </div>

            <div>
              <label className="block text-gray-700 font-bold">Explanation</label>
              <textarea
                name="explanation"
                value={testcase.explanation}
                onChange={(e) => handleTestcaseChange(index, e)}
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={2}
              ></textarea>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full px-4 py-3 bg-green-500 text-white font-bold text-lg rounded-md hover:bg-green-600"
      >
        Submit Problem
      </button>
    </form>
  );
};

export default AddProblemEnhanced;
