# The Ledger — production image.
# Portable on purpose: runs on Render, Railway, Fly, Cloud Run or any host
# that can run a container. No host-specific assumptions.
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
# The host assigns the port. server.ts reads process.env.PORT and falls back
# to 3000 only for local runs. Hardcoding 3000 is what made this undeployable.
EXPOSE 3000
CMD ["node", "dist/server.cjs"]
