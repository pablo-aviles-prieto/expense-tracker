FROM node:18-alpine as BUILD_IMAGE

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

FROM node:18-alpine
WORKDIR /app

# copy from build image
COPY --from=BUILD_IMAGE /app .

EXPOSE 3000

CMD ["npm", "start"]