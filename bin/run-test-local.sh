if [ $# -eq 0 ]
  then
    echo "No arguments supplied"
    exit 
fi

existingContainer=`docker ps -qf name=featuretestdb`

if [ -z "$existingContainer" ]
then
  docker run -d --name featuretestdb rethinkdb
  docker run -it -v `pwd`:/app --link featuretestdb -e DB_HOST=featuretestdb -e DB_NAME=featuretests msplat/auth-api npm run migrate
fi

docker run -it -v `pwd`:/app --link featuretestdb -e PORT=8011 -e DB_HOST=featuretestdb -e DB_NAME=featuretests msplat/auth-api $*
