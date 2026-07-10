import React from "react";
import axios from "axios";
import { API_URL } from "../config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Problemset = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/problem`);
        setProblems(response.data);
      } catch (err) {
        setErr(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const handleClick = (id) => {
    navigate(`/problemset/${id}`);
  };

  return (
    <div className="min-h-screen">
      <section className="shell pt-16 pb-10 md:pt-20">
        <span className="label">Problem set</span>
        <div className="mt-5 flex items-end justify-between gap-6">
          <h1 className="font-display text-5xl font-bold uppercase tracking-tight text-black md:text-6xl">
            Problems
          </h1>
          {!loading && !err && (
            <span className="mb-2 font-mono text-xs uppercase tracking-label text-neutral-400">
              {problems.length} total
            </span>
          )}
        </div>
      </section>

      <section className="shell pb-24">
        {loading && <StatusRow>Loading problems…</StatusRow>}

        {err && (
          <StatusRow>
            <span className="text-signal">Error</span> — {err.message}
          </StatusRow>
        )}

        {!loading && !err && problems.length === 0 && (
          <StatusRow>No problems yet. Check back soon.</StatusRow>
        )}

        {!loading && !err && problems.length > 0 && (
          <ul className="border-t border-neutral-200">
            {problems.map((problem, i) => (
              <li key={problem.id}>
                <button
                  onClick={() => handleClick(problem.id)}
                  className="group flex w-full items-center gap-5 border-b border-neutral-200 py-6 text-left transition-colors hover:bg-neutral-50 md:gap-8"
                >
                  <span className="w-8 shrink-0 font-mono text-sm text-neutral-300 transition-colors group-hover:text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-lg font-semibold uppercase tracking-tight text-black md:text-xl">
                      {problem.title}
                    </h2>
                    {problem.desc && (
                      <p className="mt-1 line-clamp-1 text-sm text-neutral-500">
                        {problem.desc}
                      </p>
                    )}
                  </div>
                  <span className="flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-label text-neutral-400 transition-colors group-hover:text-black">
                    <span className="hidden sm:inline">Solve</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

const StatusRow = ({ children }) => (
  <div className="border-y border-neutral-200 py-10 font-mono text-sm text-neutral-500">
    {children}
  </div>
);

export default Problemset;
