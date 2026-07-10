import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Compiler from "./compiler";
import { Trash2, ArrowLeft } from "lucide-react";
import { AuthContext } from "./AuthContext";
import { API_URL } from "../config";

const Solve = () => {
  let { id } = useParams();
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [problem, setProblem] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/problem/${id}`);
        setProblem(response.data);
      } catch (err) {
        setErr(err);
      }
    };
    fetchProblem();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this problem? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_URL}/api/problem/delete`, { params: { id } });
      navigate("/problemset");
    } catch (err) {
      console.error("Error deleting the problem:", err);
      alert("Failed to delete the problem");
    }
  };

  if (err)
    return (
      <div className="shell py-24 font-mono text-sm text-neutral-500">
        <span className="text-signal">Error</span> — {err.message}
      </div>
    );

  if (!problem)
    return (
      <div className="shell py-24 font-mono text-sm text-neutral-500">
        Loading problem…
      </div>
    );

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Statement */}
        <div className="border-neutral-200 lg:border-r lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <div className="px-6 py-10 md:px-10">
            <button
              onClick={() => navigate("/problemset")}
              className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-label text-neutral-400 transition-colors hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              All problems
            </button>

            <div className="flex items-start justify-between gap-6">
              <div>
                <span className="label">Problem</span>
                <h1 className="mt-4 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-black md:text-4xl">
                  {problem.title}
                </h1>
              </div>
              {user && user.role === "admin" && (
                <button
                  onClick={handleDelete}
                  className="btn mt-1 shrink-0 gap-1.5 border border-neutral-300 px-3 py-2 text-xs uppercase tracking-label text-neutral-500 transition-colors hover:border-signal hover:text-signal"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )}
            </div>

            {problem.desc && (
              <p className="mt-6 text-base leading-relaxed text-neutral-700">
                {problem.desc}
              </p>
            )}

            <div className="mt-10 space-y-8">
              <Block title="Input">{problem.input}</Block>
              <Block title="Output">{problem.output}</Block>
              <Block title="Constraints">{problem.constraints}</Block>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-neutral-50 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <div className="px-6 py-10 md:px-10">
            <Compiler problem={problem} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Block = ({ title, children }) => {
  if (!children) return null;
  return (
    <div className="border-t border-neutral-200 pt-6">
      <h2 className="label">{title}</h2>
      <p className="mt-3 whitespace-pre-wrap font-mono text-sm leading-relaxed text-neutral-800">
        {children}
      </p>
    </div>
  );
};

export default Solve;
