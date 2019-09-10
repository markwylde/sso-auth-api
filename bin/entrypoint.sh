#!/bin/bash

echo "WHY"

DB_HOST=${DB_HOST:-db}

/app/bin/wait-for-it.sh -t 0 $DB_HOST:28015

npm run migrate

if [ $NODE_ENV = "development" ]; then
  npm run start:dev
else
  npm run start
fi
