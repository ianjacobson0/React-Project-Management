FROM node:alpine

RUN mkdir -p /app/pm-backend
WORKDIR /app/pm-backend

COPY . .

RUN npm install

RUN npx prisma migrate deploy; exit 0

RUN npm run build

RUN npm run transpile

EXPOSE 3001

CMD ["npm", "run", "start-production"]


