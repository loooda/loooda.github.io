FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lockfile
COPY package*.json ./

# Install dependencies including dev dependencies (required for building)
RUN npm install

# Copy all application files
COPY . .

# Build the Vite client-side static files and the CJS server bundle
RUN npm run build

# Expose port 7860 (default for Hugging Face Spaces)
ENV NODE_ENV=production
ENV PORT=7860
EXPOSE 7860

# Run the unified Express production backend server
CMD ["npm", "start"]
