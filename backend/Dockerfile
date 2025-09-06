FROM node:iron-alpine3.21
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 5000
CMD ["npm", "run", "dev"]
