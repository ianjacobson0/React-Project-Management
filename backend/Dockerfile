FROM node:alpine

RUN mkdir -p /app/pm-backend

WORKDIR /app/pm-backend

COPY . .

ENV DATABASE_URL=$DATABASE_URL

ENV JWT_SECRET=$JWT_SECRET

RUN npm install

RUN npm run create-env

RUN npx prisma migrate deploy

RUN npm run build

RUN npm run transpile

EXPOSE 3001

CMD ["npm", "run", "start-production"]


