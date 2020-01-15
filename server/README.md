# Pyrog 2

```sh
yarn # install dependencies
yarn build:docker # build docker image
docker-compose up # launches postgres and pyrog in docker
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
yarn seed <mapping.json>
```

This will create the template (if needed), the source and all its resources.
