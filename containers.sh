#!/usr/bin/env bash 
# echo
# echo "========== build postgres in docker ========="
# echo
# docker build -t carcassone-postgres -f ./Postgres.Dockerfile .
echo
echo "========== stop > rm > run postgres in docker ========="
echo
docker stop /carcassone-postgres
docker rm /carcassone-postgres
docker run -d --name="carcassone-postgres" \
    --env-file ../.env \
    --restart always \
    -p 54322:5432 \
    -v /home/yarygin/data/postgres:/var/lib/postgresql/data \
    -t postgres

# echo
# echo "========== build redis in docker ========="
# echo
# docker build -t carcassone-redis -f ./Redis.Dockerfile .
echo
echo "========== stop > rm > run  redis in docker ========="
echo
docker stop /carcassone-redis
docker rm /carcassone-redis
docker run -d --name="carcassone-redis" \
    --env-file ../.env \
    --restart always \
    -p 6380:6379 \
    -v /home/yarygin/data/redis:/var/lib/redis \
    -t redis
