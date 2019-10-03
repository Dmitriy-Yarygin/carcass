FROM redis:latest

VOLUME /var/lib/redis

EXPOSE 6379

CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]