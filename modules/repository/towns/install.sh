#!/bin/bash
set -e

# Verify that the DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "DATABASE_URL is not set"
    exit 1
fi

# Verify that the towns.sql file exists
if [ ! -f towns.sql ]; then
    echo "towns.sql file does not exist - see README.md"
    exit 1
fi

docker run \
    --rm \
    -v "$(pwd)":/data \
    -w /data \
    --network host \
    -e DATABASE_URL=$DATABASE_URL \
    docker.io/bitnami/postgresql:17 bash -c 'psql $DATABASE_URL -f towns.sql'
