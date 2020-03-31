# Use node 11.10.1 LTS
FROM node:11.10.1

COPY . /app

WORKDIR /app

RUN npm install

RUN npm rebuild node-sass

EXPOSE 3000

CMD ["npm", "start"]