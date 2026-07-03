// Central place for the two backend base URLs.
//
// Vite inlines any variable named VITE_* at BUILD TIME (during `npm run build`)
// wherever `import.meta.env.VITE_...` appears. If a value isn't provided, we
// fall back to localhost so local `npm run dev` keeps working with no setup.
//
// For a deployed build you set VITE_API_URL / VITE_AUTH_URL to the real
// backend URLs before building (see .env.example and the frontend Dockerfile).

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";
export const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:8000";
