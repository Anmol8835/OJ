import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      await logout();
      navigate("/");
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center">
      <div className="shell">
        <span className="label">Session</span>
        <p className="mt-4 font-display text-2xl font-semibold uppercase tracking-tight text-black">
          Signing out…
        </p>
      </div>
    </div>
  );
};

export default Logout;
