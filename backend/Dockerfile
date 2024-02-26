FROM node:alpine

ARG DATABASE_URL

RUN mkdir -p /app/pm-backend

WORKDIR /app/pm-backend

COPY . .

ENV DATABASE_URL=$DATABASE_URL

RUN echo $DATABASE_URL

RUN npm install

RUN npm run env

RUN npx prisma migrate deploy

RUN npm run build

RUN npm run transpile

EXPOSE 3001

CMD ["npm", "run", "start-production"]


