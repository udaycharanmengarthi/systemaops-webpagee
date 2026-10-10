FROM node:20-alpine

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
RUN mkdir -p /tmp/site && cp -R /app/dist/. /tmp/site/ \
    && mkdir -p /app/dist/admin \
    && cp -R /tmp/site/. /app/dist/admin/ \
    && rm -rf /tmp/site \
    && cp /app/serve.json /app/dist/serve.json

RUN npm install -g serve

# Internal only: reachable via the reverse proxy (/admin/ -> admin:3001).
# Never published to the host in production.
EXPOSE 3001

CMD ["serve", "-s", "dist", "-l", "3001"]
