FROM node:16.10.0-stretch as devbuild
USER root
WORKDIR /app
COPY *.json /app/
COPY *.lock /app/
COPY src/ /app/src/
COPY .env .env
RUN yarn install
RUN yarn build

FROM devbuild as test
RUN yarn install
RUN yarn lint
RUN yarn test:cov
RUN rm .env

FROM devbuild as pre-prod
RUN yarn install --production
EXPOSE 3000

FROM devbuild as production-build
COPY --from=pre-prod --chown=node:node /app/node_modules /app/node_modules
COPY --from=pre-prod --chown=node:node /app/dist/ /app/
ENV NODE_ENV=production
ENTRYPOINT ["node", "main.js", "echo ${PORT}"]
