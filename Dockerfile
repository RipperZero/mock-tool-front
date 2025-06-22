FROM node:22.16.0-alpine AS node-base

# deps stage → Install dependencies
FROM node-base AS deps-stage

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY ["package.json","yarn.lock*","package-lock.json*","pnpm-lock.yaml*","./"]

RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

# build stage → build the source
FROM node-base AS build-stage

WORKDIR /app

# copy node_modules from deps-stage to build-stage(current)
COPY --from=deps-stage /app/node_modules ./node_modules
# copy all files(except content in .dockerignore)
# from current folder(where Dockerfile is set[docker build context])
# to build-stage(current)
COPY . .

# RUN yarn run build
# If using npm comment out above and use below instead
RUN npm run build

# ==========>>>>>>>>>> use Nginx ---start
# production stage → copy built files then set to nginx
FROM nginx:latest

# Copy built files from the build-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html/mock-tool-front

# Copy the custom Nginx config file from the host
COPY /docker/nginx/conf/mock-tool-front.conf /etc/nginx/conf.d/default.conf

# Expose Nginx port
EXPOSE 80

# Expose Nginx config directory as a volume
VOLUME ["/etc/nginx/conf.d"]

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
# ==========>>>>>>>>>> use Nginx ---end

# # ==========>>>>>>>>>> use Apache ---start
# # production stage → copy built files then set to httpd
# FROM httpd:latest

# # Copy built files from the build-stage
# COPY --from=build-stage /app/dist /usr/local/apache2/htdocs/mock-tool-front

# # Copy the custom Apache config file from the host
# COPY /docker/apache/conf/mock-tool-front.conf /usr/local/apache2/conf/httpd.conf

# # Expose Apache port
# EXPOSE 80

# # Expose Apache config directory as a volume
# VOLUME ["/usr/local/apache2/conf"]
# VOLUME ["/usr/local/apache2/htdocs"]

# # Start Apache
# CMD ["httpd", "-D", "FOREGROUND"]
# # ==========>>>>>>>>>> use Apache ---end