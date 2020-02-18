# Pyrog 2

## Dev

```sh
yarn # install dependencies
docker-compose up postgres # launches postgres in docker
yarn dev # runs pyrog-server with hot-reloading (using ts-node)
yarn seed:superuser # inserts an admin user in the db (dont forget to have SUPERUSER_PASSWORD in your .env)
```

## Build

```sh
yarn build # builds a nodeJS bundle
yarn start # runs using nodeJS
```

## Import a source from a mapping file

If you have an exported mapping as a JSON file, you can import it directly into Pyrog using a single command.

For this to work, you need to have a postgres service up and running and configure the connection url (`POSTGRES_URL`) in the `.env` file.

You also need to apply the migrations to the database before importing the mapping.

### Example

```sh
# run the postgres service in docker
docker-compose up postgres

# apply the migrations if needed
yarn prisma2 lift up

# import the mapping from a file.
yarn seed:mapping <mapping.json>
```

This will create the template (if needed), the source and all its resources.

## Build a docker image

```sh
yarn build:docker
```

## Run pyrog server in docker

```sh
# this will launch a postgres service as well as a pyrog one.
docker-compose up
```
