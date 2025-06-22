# Build the application
FROM node:16.17-alpine AS builder
RUN apk update \
    && apk add build-base py3-pip

WORKDIR /app
COPY . .
RUN yarn install --network-timeout 100000
RUN yarn test
RUN yarn lint:build
RUN yarn build

# Deploy the application on Nginx
FROM nginx:1.23.2-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY docker/conf/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
