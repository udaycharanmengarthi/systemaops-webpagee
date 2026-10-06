FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production

RUN addgroup -S app && adduser -S app -G app

# Data dir (admin avatar uploads) with app ownership BEFORE the volume
# mounts: Docker's named-volume copy-up preserves these permissions.
RUN mkdir -p /app/data/admin-avatars && chown -R app:app /app/data

USER app

EXPOSE 5000

CMD ["node", "server.js"]