import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `relative font-mono text-xs uppercase tracking-label transition-colors duration-150 ${
      isActive
        ? "text-black after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-full after:bg-signal"
        : "text-neutral-400 hover:text-black"
    }`;

  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/problemset", label: "Problems" },
    ...(user?.role === "admin" ? [{ to: "/add", label: "Add" }] : []),
  ];

  const close = () => setOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/85 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between">
        {/* Wordmark */}
        <NavLink to="/" onClick={close} className="group flex items-baseline gap-2">
          <span className="font-display text-lg font-bold uppercase tracking-tight text-black">
            CodeCraft
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-label text-signal sm:inline">
            /oj
          </span>
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-8">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} className={linkClass}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="h-4 w-px bg-neutral-200" />

          {user ? (
            <NavLink to="/logout" className="btn-secondary px-4 py-2 text-xs uppercase tracking-label">
              Logout
            </NavLink>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink
                to="/login"
                className="font-mono text-xs uppercase tracking-label text-neutral-400 transition-colors hover:text-black"
              >
                Login
              </NavLink>
              <NavLink to="/register" className="btn-primary px-4 py-2 text-xs uppercase tracking-label">
                Register
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-black md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-neutral-200 bg-white md:hidden">
          <ul className="shell flex flex-col gap-5 py-6">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} onClick={close} className={linkClass}>
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li className="rule pt-5">
              {user ? (
                <NavLink to="/logout" onClick={close} className="btn-secondary px-4 py-2 text-xs uppercase tracking-label">
                  Logout
                </NavLink>
              ) : (
                <div className="flex items-center gap-4">
                  <NavLink
                    to="/login"
                    onClick={close}
                    className="font-mono text-xs uppercase tracking-label text-neutral-400 hover:text-black"
                  >
                    Login
                  </NavLink>
                  <NavLink to="/register" onClick={close} className="btn-primary px-4 py-2 text-xs uppercase tracking-label">
                    Register
                  </NavLink>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
