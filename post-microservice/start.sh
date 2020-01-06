docker build --rm -f Dockerfile -t news-post .

docker run --name news-post -l=apiRouter='/api/v1/post' -p 3003:3003 --env-file ./.env -d news-post
