FROM oven/bun
WORKDIR /app
COPY ./src ./src
COPY package*.json ./
COPY tsconfig.json ./
COPY ./node_modules ./node_modules
COPY bun.lockb ./
RUN bun install
RUN bun add -d bun-types

ARG PORT
EXPOSE ${PORT:-3000}
 
CMD ["bun", "./src/index.ts"]