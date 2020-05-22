# build container
FROM node:alpine as build

WORKDIR /src

COPY package.json .
RUN npm install

COPY . .
# RUN npm run test
RUN npm run build


# production runtime container
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /src/dist .

# CMD in base container
