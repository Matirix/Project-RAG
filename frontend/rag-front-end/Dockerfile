# Use Deno official image
FROM denoland/deno:2.6.3

WORKDIR /app

# Copy only lock files first to leverage caching
COPY package.json  ./

# Copy rest of code
COPY . .

RUN deno cache package.json
RUN deno install

# Run dev server
CMD ["deno", "run", "dev"]
