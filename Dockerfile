# Stage 1 (build)
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 (production)
FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
EXPOSE 4000
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
RUN apk add --no-cache curl
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
CMD ["node", "dist/main"]
