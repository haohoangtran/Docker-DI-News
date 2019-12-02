docker build --rm -f Dockerfile -t news-category .
docker run --name news-category -l=apiRouter='/api/v1/category' -p 3002:3002 --env-file ./.env -d news-category