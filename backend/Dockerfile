FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY admin-dashboard/package.json admin-dashboard/package.json
COPY mobile-app/package.json mobile-app/package.json

RUN npm install --workspaces

COPY . .

EXPOSE 5000

CMD ["npm", "--workspace", "backend", "run", "start"]
