# Pyrog 2

## Dev

In dev, .env file must be used to run commands. You can use `env $(cat .env) yarn ...`
but the simplest solution is to install dotenv globallay (`yarn global add dotenv`).

```sh
yarn # install dependencies
dotenv yarn generate # generate the "photon" dependency, required by prisma
docker-compose up postgres redis # launches postgres and redis in docker (you may use the `-d` option to run in the background)
dotenv yarn migrate # applies the prisma migrations on the postrges database
dotenv yarn seed:superuser # inserts an admin@arkhn.com user in the db (dont forget to have SUPERUSER_PASSWORD in your .env)
dotenv yarn dev # runs pyrog-server with hot-reloading (using ts-node)
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

## Build a docker image

```sh
yarn build:docker
```

## Run pyrog server in docker

```sh
# this will launch a postgres service as well as a pyrog one.
docker-compose up
```
