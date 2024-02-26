FROM node:alpine

RUN mkdir -p /app/pm-backend

WORKDIR /app/pm-backend

COPY . .

ENV DATABASE_URL="postgres://postgres:JEAPCrL020hvXHb@34.132.27.249:5432/project-management-db"

RUN npm install

RUN npm run env

RUN npx prisma migrate deploy

RUN npm run build

RUN npm run transpile

EXPOSE 3001

CMD ["npm", "run", "start-production"]


