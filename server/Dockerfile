FROM node:13-alpine AS build-image

RUN apk update && apk add openssl-dev libssl1.1 wget unzip git

WORKDIR /build

ENV POSTGRES_URL=postgresql://required:by@prisma/generate

# Install deps for production only
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json
COPY yarn.lock yarn.lock

RUN yarn --frozen-lockfile
RUN yarn cache clean --force

COPY prisma prisma
COPY src src

RUN yarn build

FROM node:13-alpine AS runtime-image

WORKDIR /srv

COPY ["package.json",  "tsconfig.json", "tsconfig.build.json", "docker-entrypoint.sh", "/srv/"]
COPY prisma prisma
COPY scripts scripts
COPY src src

COPY --from=build-image /build/node_modules ./node_modules
COPY --from=build-image /build/dist ./dist

EXPOSE 1000

RUN chmod +x /srv/docker-entrypoint.sh
ENTRYPOINT [ "/srv/docker-entrypoint.sh" ]
