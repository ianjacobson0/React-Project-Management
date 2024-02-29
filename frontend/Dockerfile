FROM node:alpine

RUN mkdir -p /app/pm-frontend
WORKDIR /app/pm-frontend

COPY . .

ENV REACT_APP_API_ENDPOINT=https://backend-ea443ufhwa-uc.a.run.app

ENV REACT_APP_GRAPHQL_ENDPOINT=https://backend-ea443ufhwa-uc.a.run.app/graphql

RUN npm install

RUN npm run env

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD [ "serve", "-s", "build", "-l", "3000" ]