FROM node:21
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV HOST=0.0.0.0
ENV PORT=3000
ENV CI=true
EXPOSE 3000
CMD ["npm", "start"]
