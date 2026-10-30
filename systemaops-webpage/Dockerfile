# ================================================================
# Build stage — keeps the original toolchain and build command so
# output is byte-identical to the previous single-stage build.
# ================================================================
FROM node:20 AS build

WORKDIR /app

# Public build-time switch only; never place Stripe secret values in the
# frontend image. Development may use it to disable the paid flow; the
# production build always uses the paid Stripe path.
ARG VITE_ENABLE_STRIPE_CHECKOUT=true
ENV VITE_ENABLE_STRIPE_CHECKOUT=$VITE_ENABLE_STRIPE_CHECKOUT

COPY package*.json ./

# Full install (vite + tailwind are devDependencies, needed for the build).
# Only the static dist/ is served at runtime.
RUN npm ci

COPY . .

RUN npm run build

# ================================================================
# Runtime stage — static SPA only. No devDependencies, no build
# toolchain, no source, no tests. Runs as a dedicated unprivileged
# user: `serve` binds unprivileged port 3000 and writes nothing.
# ================================================================
FROM node:20-alpine

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app && npm install -g serve

COPY --from=build /app/dist ./dist

USER app

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
