FROM node:18-alpine AS build_image

# Define build-time environment variables
ARG MONGODB_URI

WORKDIR /app

COPY package*.json .

# install dependencies
RUN npm install --frozen-lockfile
COPY . .

# build
RUN npm run build

# remove dev dependencies
RUN npm prune --production

# --- FINAL IMAGE STAGE ---
FROM node:18-alpine

ENV TZ=Europe/Madrid

WORKDIR /app

# copy from build image
COPY --from=build_image /app .

EXPOSE 3000

CMD ["npm", "run", "start:cron"]