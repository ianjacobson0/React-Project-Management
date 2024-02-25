FROM node:alpine

RUN mkdir -p /app/pm-backend

WORKDIR /app/pm-backend

COPY . .

ENV DATABASE_URL=$DATABASE_URL

RUN npm install

RUN npm run build

RUN npm run transpile

RUN npx prisma migrate deploy

EXPOSE 3001

CMD ["npm", "run", "start-production"]


