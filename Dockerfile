FROM node:14-alpine as BUILD_IMAGE
WORKDIR /usr/src/app

COPY . ./

RUN ["yarn", "install"]
RUN ["yarn", "build"]

FROM node:14-alpine
WORKDIR /usr/src/app

ENV NODE_ENV production

COPY --from=BUILD_IMAGE /usr/src/app/ ./

EXPOSE ${PORT}

# TODO: Add token as env variable
CMD ["yarn", "start_with_logging", "--token=${QNwvCaqW7F7bhpMKnqF52YDA}"]