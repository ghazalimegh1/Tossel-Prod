# Build stage for assets (if any preprocessing needed)
FROM nginx:alpine

# Copy frontend files to nginx html directory
COPY html /usr/share/nginx/html/html
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY assets /usr/share/nginx/html/assets

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
