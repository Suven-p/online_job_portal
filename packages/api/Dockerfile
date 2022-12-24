# syntax=docker/dockerfile:1
FROM node:19-bullseye-slim
WORKDIR /
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
CMD ["yarn", "run", "start"]
EXPOSE 3000

