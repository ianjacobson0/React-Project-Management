FROM node:alpine

ARG API_ENDPOINT

ARG GRAPHQL_ENDPOINT

RUN mkdir -p /app/pm-frontend
WORKDIR /app/pm-frontend

COPY . .

ENV REACT_APP_API_ENDPOINT=$API_ENDPOINT

ENV REACT_APP_GRAPHQL_ENDPOINT=$GRAPHQL_ENDPOINT

RUN npm run env

RUN npm install

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD [ "serve", "-s", "build", "-l", "3000" ]