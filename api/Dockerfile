# build container
FROM node:alpine as build

RUN apk update && apk add git

WORKDIR /src

COPY package.json .
RUN npm install

COPY . .
# RUN npm run test
RUN npm run build

RUN npm prune --production


# production runtime container
FROM node:alpine

ENV PORT=3000
ENV NODE_ENV=production
ENV MEMSQL_HOST=memsql
ENV MEMSQL_USERNAME=root
ENV MEMSQL_PASSWORD=
ENV MEMSQL_DB=acme

WORKDIR /app
COPY --from=build /src/node_modules /app/node_modules
COPY --from=build /src/dist .

CMD ["node", "index.js"]
