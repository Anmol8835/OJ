# 1. Start from an official Node image. "22" matches your local Node version.
#    "-slim" = a smaller Debian-based image. We pick Debian (not Alpine) because
#    installing g++ is straightforward with apt-get.
FROM node:22-slim

# 2. Install g++ so the backend can compile user-submitted C++ inside the container.
#    This is THE reason this app needs a custom image. We clean up the apt cache
#    afterwards to keep the image small.
RUN apt-get update && apt-get install -y g++ && rm -rf /var/lib/apt/lists/*

# 3. Set the working directory inside the image. Every command after this runs here,
#    and it's where our code will live: /app
WORKDIR /app

# 4. Copy ONLY the dependency manifests first. This is a caching trick:
#    if these files don't change, Docker reuses the cached "npm install" layer
#    on future builds instead of reinstalling everything. Speeds up rebuilds a lot.
COPY package*.json ./

# 5. Install dependencies inside the image (Linux-native, fresh).
RUN npm install

# 6. Copy the Prisma schema + config, then generate the Prisma client.
#    Prisma needs a generated client to talk to Postgres; this bakes it into the image.
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

# 7. Now copy the rest of the source code (everything not excluded by .dockerignore).
COPY . .

# 8. Document that the app listens on port 8001 (from your index.js).
#    This is informational; actual port mapping happens when we RUN the container.
EXPOSE 8001

# 9. The command that runs when the container starts.
CMD ["node", "index.js"]
