#!/usr/bin/env bash 
echo
echo "========== build postgres in docker ========="
echo
docker build -t carcassone-client -f ./Client.Dockerfile .
echo
echo "========== stop > rm > run client with nginx in docker ========="
echo
docker stop /carcassone-client
docker rm /carcassone-client
docker run -d --name carcassone-client -p 82:80 carcassone-client
