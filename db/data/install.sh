#!/bin/bash
set -e

# Verify that the DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "DATABASE_URL is not set"
    exit 1
fi

docker run \
    --rm \
    -v "$(pwd)":/data \
    -w /data \
    --network host \
    -e DATABASE_URL=$DATABASE_URL \
    postgres bash -c 'psql $DATABASE_URL -f towns.sql'
