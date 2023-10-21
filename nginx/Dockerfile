FROM nginx:1.21-alpine
EXPOSE 80/tcp
EXPOSE 443/tcp
ENV ENVIRONMENT=$ENVIRONMENT
ENV TLS_MODE=$TLS_MODE
ENV SITE_HOST=$SITE_HOST
RUN apk add --no-cache esh curl openssl
RUN curl https://get.acme.sh | sh
RUN ln -s  /root/.acme.sh/acme.sh  /usr/local/bin/acme.sh
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf.esh ssl_params frontend /etc/nginx/
CMD ["/bin/sh", "-c", "esh -o /etc/nginx/conf.d/nginx.conf /etc/nginx/nginx.conf.esh && exec nginx -g 'daemon off;'"]
