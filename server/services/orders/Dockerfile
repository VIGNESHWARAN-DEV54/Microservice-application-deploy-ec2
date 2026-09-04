FROM  node:21
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5004
CMD ["npm","run","dev"]