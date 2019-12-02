docker build --rm -f Dockerfile -t news-api-gateway .
docker run --name news-api-gateway -p 3000:3000 --env-file ./.env -v /var/run/docker.sock:/Users/haoht/docker.sock -d  news-api-gateway
