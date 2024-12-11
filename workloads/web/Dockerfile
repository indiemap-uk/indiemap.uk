# You need to build the image from the root of the project,
# as the Docker context must contain all the modules!
#
# docker build -t indiemap --file workloads/web/Dockerfile .
#
# Run it with all the required env vars (this is for local testing):
#
# docker run -it --rm -e ADMIN_USER_EMAILS -e AUTH_RESEND_KEY -e AUTH_SECRET -e DATABASE_URL -e GEOCODIFY_API_KEY -p 3333:3000 indiemap
# 
# BUILD STAGE
FROM node:22-alpine
WORKDIR /build
COPY . .
RUN mkdir /pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
RUN corepack use pnpm@latest
# Install NPM packages for the Web deployment only
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter web... install --frozen-lockfile
# Build the Web deployment
RUN pnpm --filter web run build
# Create a portable package that runs without additional steps (https://pnpm.io/cli/deploy).
# Requires "build" from above. 
# See the "files" section in the web/package.json: it must contain the "build" folder.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter-prod web --prod deploy ./deploy

# RUN STAGE
FROM node:22-alpine
WORKDIR /web
COPY --from=0 /build/deploy .

EXPOSE 3333
ENV PORT=3333
ENV ORIGIN=http://localhost:3333
CMD ["node", "build"]