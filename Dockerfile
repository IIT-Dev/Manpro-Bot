FROM node:18-alpine as BUILD_IMAGE
WORKDIR /usr/src/app

COPY . ./

RUN ["yarn", "install"]
RUN ["yarn", "build"]

FROM node:18-alpine
WORKDIR /usr/src/app

ENV NODE_ENV production

COPY --from=BUILD_IMAGE /usr/src/app/ ./

EXPOSE ${PORT}

CMD ["yarn", "start"]