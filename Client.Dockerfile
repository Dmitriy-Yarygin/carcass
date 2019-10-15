FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /build
COPY . /usr/share/nginx/static

CMD ["nginx", "-g", "daemon off;"]