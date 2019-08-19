if [ $# -eq 0 ]
  then
    echo "No arguments supplied"
    exit 
fi

existingContainer=`docker ps -qf name=featuretestdb`
dockerHost=`docker-machine ip local`

if [ -z "$existingContainer" ]
then
  docker run -d -p 8181:8080 -p 28115:28015 --name featuretestdb rethinkdb
  PORT=8011 DB_HOST=$dockerHost DB_PORT=28115 DB_NAME=featuretests npm run migrate
fi

PORT=8011 DB_HOST=$dockerHost DB_PORT=28115 DB_NAME=featuretests $@
