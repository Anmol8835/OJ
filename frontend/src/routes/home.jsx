import React from "react";
import { Link } from "react-router-dom";
import { Terminal, ListChecks, Gauge } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="shell pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 md:col-span-9">
            <span className="label">01 — Online Judge</span>
            <h1 className="mt-6 font-display text-6xl font-bold uppercase leading-[0.92] tracking-tight text-black sm:text-7xl md:text-8xl">
              Practice.
              <br />
              Compile.
              <br />
              <span className="text-signal">Solve.</span>
            </h1>
          </div>
          <div className="col-span-12 md:col-span-3">
            <p className="max-w-xs text-base leading-relaxed text-neutral-500">
              A quiet place to sharpen your algorithmic edge. Real problems,
              real compilation, instant verdicts.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Link to="/problemset" className="btn-primary">
            Explore problems
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link to="/register" className="btn-secondary">
            Create account
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="rule">
        <div className="shell py-20 md:py-24">
          <span className="label">02 — What you get</span>
          <div className="mt-10 grid grid-cols-1 divide-y divide-neutral-200 md:grid-cols-3 md:divide-x md:divide-y-0">
            <Feature
              index="A"
              icon={<Terminal className="h-5 w-5" />}
              title="Real Compilation"
              description="Write C++, run it against live input, and watch it execute — not a simulation."
            />
            <Feature
              index="B"
              icon={<ListChecks className="h-5 w-5" />}
              title="Curated Problems"
              description="A growing set of problems with hidden test cases that check every edge."
            />
            <Feature
              index="C"
              icon={<Gauge className="h-5 w-5" />}
              title="Instant Verdicts"
              description="Submit and know immediately: accepted, or back to the drawing board."
            />
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="rule bg-black text-white">
        <div className="shell flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-label text-neutral-500">
              03 — Ready?
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold uppercase tracking-tight md:text-4xl">
              Open the editor. Start solving.
            </h2>
          </div>
          <Link
            to="/problemset"
            className="btn border border-white px-6 py-3 text-white transition-colors hover:bg-white hover:text-black"
          >
            Go to problems
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>

      <footer className="shell flex flex-col items-start justify-between gap-2 py-10 text-xs text-neutral-400 sm:flex-row sm:items-center">
        <span className="font-mono uppercase tracking-label">CodeCraft /oj</span>
        <span>Built for people who like clean things.</span>
      </footer>
    </div>
  );
};

const Feature = ({ index, icon, title, description }) => (
  <div className="group px-0 py-8 md:px-8 md:py-2 md:first:pl-0 md:last:pr-0">
    <div className="flex items-center justify-between">
      <span className="text-neutral-900 transition-colors group-hover:text-signal">
        {icon}
      </span>
      <span className="font-mono text-xs text-neutral-300">{index}</span>
    </div>
    <h3 className="mt-6 font-display text-lg font-semibold uppercase tracking-tight text-black">
      {title}
    </h3>
    <p className="mt-3 text-sm leading-relaxed text-neutral-500">{description}</p>
  </div>
);

export default Home;
