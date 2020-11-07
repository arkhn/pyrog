# Pyrog 2

## Dev

In dev, .env file must be used to run commands. You can use `env $(cat .env) yarn ...`
but the simplest solution is to install dotenv globallay (`yarn global add dotenv`).

```sh
yarn # install dependencies
dotenv yarn generate # generate the "@prisma/client" dependency, required by prisma
docker-compose up postgres redis # launches postgres and redis in docker (you may use the `-d` option to run in the background)
dotenv yarn migrate:up # applies the prisma migrations on the postrges database
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

## Create a superuser
```shell script
SUPERUSER_EMAIL=admin@arkhn.com \
SUPERUSER_PASSWORD=password \
IDENTITY_PROVIDER_URL=https://staging.arkhn.com/identity-provider \
yarn seed:superuser
```

## Release

Each push (commits and/or tags) will publish a single image to the DockerHub registry.

Each image will have one or more docker tags, depending on the context:

- on every branch (including `master`), images have following tags:
  - the first 8 chars of the targetted commit hash,
  - the branch name, with `/` replaced by `-`. For instance the branch `jd/fix/1` will have the `jd-fix-1` tag on DockerHub.
- on `master`, images have **additional** tags:
  - the version, only if the push is a tag (i.e. `git push --tags api/<version>`),
  - the `latest` tag, for the most recent pushed tag.

## Versioning of `pyrog-server`

The api must follow a [**semantic versioning**](https://semver.org/).

## Publishing a new release of `pyrog-server`

### 1. Tag the target commit (on `master`)

        git tags api/vX.Y.Z [<commit-sha>]

Tags for the `pyrog-server` should be prefixed with `api`. For instance, use `api/v1.1.0` if you want to publish the `v1.1.0` version of the `pyrog-server` on DockerHub.

### 2. Push the tag

        git push --tags api/vX.Y.Z

Providing that the CI workflow is successful (which should always be the case on `master`...), a new image will soon be available on DockerHub with the specified tag.

### 3. Pull the tagged image

        docker pull arkhn/pyrog-server:vX.Y.Z
