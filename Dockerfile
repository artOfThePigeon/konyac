FROM oven/bun
WORKDIR /app
COPY ./src ./src
COPY package*.json ./
COPY tsconfig.json ./
COPY ./node_modules ./node_modules
COPY bun.lockb ./
RUN bun install

ARG PORT
EXPOSE ${PORT:-8000}
 
CMD ["bun", "./src/index.tsx"]