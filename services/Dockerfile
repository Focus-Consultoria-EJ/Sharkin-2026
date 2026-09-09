FROM oven/bun:1.3
WORKDIR /app

COPY package.json bun.lock tsconfig.json ./
RUN bun install

COPY prisma ./prisma
RUN bunx prisma generate --schema=prisma/schema.prisma

COPY prisma.config.ts ./

COPY lib ./lib
COPY src ./src

RUN mkdir -p /app/dist && chown bun:bun /app/dist
USER bun
EXPOSE 3001/tcp

CMD [ "bun", "run", "./src/main.ts" ]
