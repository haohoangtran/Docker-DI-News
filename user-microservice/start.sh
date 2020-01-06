docker build --rm -f Dockerfile -t news-user .
docker run --name news-user -l=apiRouter='/api/v1/user' -p 3001:3001 --env-file ./.env -d news-user