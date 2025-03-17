FROM node:22-alpine AS build

ARG FRONT_BACKEND_URL
ENV VITE_API_URL=$FRONT_BACKEND_URL

WORKDIR /app
COPY . /app/

RUN npm install
RUN npm run build

RUN ls /app
RUN ls /app/dist


FROM nginx:stable-alpine AS frontend

COPY ./.deploy/default.conf /etc/nginx/conf.d/
COPY --from=build /app/dist/ /usr/share/nginx/html/
