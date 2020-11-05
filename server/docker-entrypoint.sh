#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

export NODE_PATH="./dist"

# wait for postgres to be up
yarn wait:db

# apply migrations
yarn migrate:up

# create superuser
yarn seed:superuser

# run the app
yarn start
