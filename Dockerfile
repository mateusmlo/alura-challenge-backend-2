#PROD
FROM node:gallium AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/finance-control

COPY . /opt/finance-control

RUN rm yarn.lock
RUN yarn global add typescript && yarn global add @nestjs/cli &&  yarn global add ts-node
RUN yarn add -D @types/node
RUN yarn install --production && yarn build

CMD ["node", "/dist/main"]

#DEV
FROM node:gallium AS development

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/finance-control

COPY . /opt/finance-control

RUN rm yarn.lock
RUN yarn global add typescript && yarn global add @nestjs/cli &&  yarn global add ts-node
RUN yarn add -D @types/node
RUN yarn && yarn build

CMD ["node", "/dist/main"]