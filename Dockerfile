FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Copy source code
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Build the project
RUN bun run build

# Final stage
FROM ubuntu:24.04 AS release
COPY --from=prerelease /app/dist ./dist

LABEL org.opencontainers.image.source="https://github.com/LemonNekoGH/airi-android"

ENTRYPOINT ["dist/airi-android"]
