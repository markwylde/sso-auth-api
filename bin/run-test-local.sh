#docker build -t msplat/auth-api:local .

if [ $# -eq 0 ]
  then
    echo "No arguments supplied"
    exit 
fi

existingContainer=`docker rm -f featuretestrunner`

if [ ! -z "$existingContainer" ]
then
  echo "featuretestrunner was removed"
fi

existingContainer=`docker ps -qf name=featuretestdb`

if [ -z "$existingContainer" ]
then
  docker run -dp 8080:8080 --name featuretestdb rethinkdb
  sleep 1
  docker run -it -v `pwd`:/app --link featuretestdb -e DB_HOST=featuretestdb -e DB_NAME=featuretests msplat/auth-api:local npm run migrate
fi

docker run --name featuretestrunner -it -v `pwd`:/app --link featuretestdb -e PORT=8011 -e DB_HOST=featuretestdb -e DB_NAME=featuretests msplat/auth-api:local $*
