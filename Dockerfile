FROM node:20-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install and build frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Install and build backend
WORKDIR /app/backend
RUN npm install && npm run build

# Copy frontend build to backend
RUN rm -rf public && cp -r ../frontend/dist public

# Set production mode
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["npm", "start"]
