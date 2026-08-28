FROM oven/bun:1.3
WORKDIR /app

COPY package.json bun.lock tsconfig.json ./
RUN bun install

COPY prisma ./prisma
RUN bunx prisma generate


COPY src ./src

USER bun
EXPOSE 3001/tcp

CMD [ "bun", "run", "./src/main.ts" ]
