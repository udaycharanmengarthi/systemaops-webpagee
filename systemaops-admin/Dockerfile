FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Full install (vite + tailwind are devDependencies, needed for the build).
# Only the static dist/ is served at runtime.
RUN npm ci

COPY . .

RUN npm run build

RUN npm install -g serve

# Internal only: reachable via the reverse proxy (/admin/ -> admin:3001).
# Never published to the host in production.
EXPOSE 3001

CMD ["serve", "-s", "dist", "-l", "3001"]
