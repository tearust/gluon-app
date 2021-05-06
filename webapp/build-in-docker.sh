tag=0.5

echo building webapp...
npm run build
echo building webapp docker image...
docker build . -t tearust/gluon-webapp:$tag

echo docker push...
docker push tearust/gluon-webapp:$tag

echo Done.