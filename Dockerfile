FROM node:20-alpine
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 9999
CMD ["npm", "run", "dev"]