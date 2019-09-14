#docker build -t msplat/auth-api:local .

if [ $# -eq 0 ]
  then
    echo "No arguments supplied"
    exit 
fi

dockerHost=`docker-machine ip local`

if [ ! -z "$existingContainer" ]
then
  echo "featuretestrunner was removed"
fi

existingContainer=`docker ps -qf name=featuretestdb`

if [ -z "$existingContainer" ]
then
  docker run -d -p 8181:8080 -p 28115:28015 --name featuretestdb rethinkdb
  sleep 1
  PORT=8011 DB_HOST=$dockerHost DB_PORT=28115 DB_NAME=featuretests npm run migrate
fi

PORT=8011 DB_HOST=$dockerHost DB_PORT=28115 DB_NAME=featuretests $@
