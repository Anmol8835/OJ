# ============================================================
# STAGE 1 — "build": use Node just long enough to compile the
# React app into static files. This whole stage is discarded
# from the final image; we only keep its output (the dist/ folder).
# ============================================================
FROM node:22-slim AS build

WORKDIR /app

# Copy manifests first for layer caching (same trick as the backend).
COPY package*.json ./
RUN npm install

# Copy the rest of the source.
COPY . .

# Build-time configuration. Vite inlines VITE_* values during the build, so we
# accept them as build args and expose them as env vars before running the build.
# Locally (no --build-arg) these are empty and config.js falls back to localhost.
# For deployment: docker build --build-arg VITE_API_URL=https://... --build-arg VITE_AUTH_URL=https://...
ARG VITE_API_URL
ARG VITE_AUTH_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AUTH_URL=$VITE_AUTH_URL

# Vite outputs static files to /app/dist.
RUN npm run build

# ============================================================
# STAGE 2 — "serve": a tiny nginx image whose only job is to
# hand out the static files. No Node, no npm, no source code.
# ============================================================
FROM nginx:alpine

# Replace nginx's default site config with our SPA-aware one.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy ONLY the built files from stage 1 into nginx's web root.
# This is what makes the final image tiny.
COPY --from=build /app/dist /usr/share/nginx/html

# nginx serves on port 80 inside the container.
EXPOSE 80

# The nginx base image already knows how to start itself, but we
# state it explicitly: run in the foreground so the container stays alive.
CMD ["nginx", "-g", "daemon off;"]
