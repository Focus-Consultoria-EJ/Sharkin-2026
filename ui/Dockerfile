FROM oven/bun:1.3
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --production

COPY src ./src
COPY tsconfig.json bun-env.d.ts ./

ENV NODE_ENV=production
ENV PORT=3000

USER bun
EXPOSE 3000/tcp

CMD [ "bun", "run", "start" ]
