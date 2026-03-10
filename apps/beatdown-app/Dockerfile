# syntax=docker/dockerfile:1

# ---- deps stage ----
FROM node:24-alpine AS deps
RUN corepack enable pnpm

WORKDIR /repo

# Copy workspace manifests for layer caching
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/beatdown-app/package.json ./apps/beatdown-app/
COPY packages/exicon-to-csv/package.json ./packages/exicon-to-csv/

RUN pnpm install --frozen-lockfile

# ---- builder stage ----
FROM node:24-alpine AS builder
RUN corepack enable pnpm

WORKDIR /repo

COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/beatdown-app/node_modules ./apps/beatdown-app/node_modules
COPY . .

RUN pnpm --filter beatdown-app run build

# ---- runner stage ----
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /repo/apps/beatdown-app/.next/standalone ./
COPY --from=builder /repo/apps/beatdown-app/.next/static ./apps/beatdown-app/.next/static
COPY --from=builder /repo/apps/beatdown-app/public ./apps/beatdown-app/public
COPY --from=builder /repo/apps/beatdown-app/drizzle ./apps/beatdown-app/drizzle

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/beatdown-app/server.js"]
