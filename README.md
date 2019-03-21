# Graphql Server

## Prerequisite

Run `docker-compose up` so as to run required docker containers.

## Commands

* Install with `yarn install`
* Run with `yarn start`
* Build with `yarn build`

## Build container

```
docker build -t arkhn/pyrog-graphql .
docker export <container name> > pyrog.tar
scp pyrog.tar root@arkhn:/var/www/html
```

```
cat pyrog.tar | docker import - arkhn/pyrog:latest
cd /var/www/html/pyrog-graphql
docker-compose up -d
```
