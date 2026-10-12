# ================================================================
# Build stage — keeps the original toolchain and build command.
# ================================================================
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

# Full install (vite + tailwind are devDependencies, needed for the build).
# Only the static dist/ is served at runtime.
RUN npm ci

COPY . .

RUN npm run build

# The console has ONE mount point: /admin/. Vite base and the router
# basename are both "/admin/", so the built index.html references
# /admin/assets/*. Serving dist/ at the root would resolve those to the
# SPA fallback (text/html -> blank page) and serve index.html at "/",
# where the router refuses to render (basename mismatch -> blank page).
#
# 1. Mirror dist/ into dist/admin/ so /admin/* resolves statically.
#    Staged copy so cp does not recurse into the directory it creates.
# 2. serve reads serve.json from the SERVED directory (not the cwd),
#    so the "/" -> /admin/ redirect must land in dist/ as well.
# No "/admin" -> "/admin/" rule: serve matches redirect sources
# non-strict, so it would also match "/admin/" and loop forever.
# serve already 301s "/admin" -> "/admin/" for the directory itself.
#
# NOTE: single-line `&&` chain on purpose — backslash line-continuation
# in this step was observed to break the mirror on some BuildKit fronts.
RUN mkdir -p /tmp/site && cp -R /app/dist/. /tmp/site/ && mkdir -p /app/dist/admin && cp -R /tmp/site/. /app/dist/admin/ && rm -rf /tmp/site && cp /app/serve.json /app/dist/serve.json

# ================================================================
# Runtime stage — static SPA only. No devDependencies, no build
# toolchain, no source, no tests. Runs as a dedicated unprivileged
# user: `serve` binds unprivileged port 3001 and writes nothing.
# ================================================================
FROM node:20-alpine

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app && npm install -g serve

COPY --from=build /app/dist ./dist

USER app

EXPOSE 3001

CMD ["serve", "-s", "dist", "-l", "3001"]
