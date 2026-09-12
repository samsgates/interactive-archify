FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile=false
RUN pnpm build

FROM node:22-alpine AS runner
RUN corepack enable
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
EXPOSE 3000
CMD ["pnpm", "--filter", "@interactive-archify/web", "start"]
