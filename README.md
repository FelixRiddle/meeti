# Meeti

Meetup clone

# Setup

These are the setup steps

## Dependency

Like 'dev-jobs' it's required to build and put the distribution files of the following packages:

* Trix 2.1.1

Its directory should be: public/package/trix@2.1.1/dist

## Environment variables

These are the environment variables that can be configured.

```
PORT=

# Secret token and key
SECRET_KEY=
SECRET_KEY_NAME=

# PostgreSQL database
# The database should never be visible from the outside(From internet)
# It should be accessed through specific endpoints in the backend
POSTGRES_DATABASE_NAME=node_app
POSTGRES_USERNAME=
POSTGRES_PASSWORD=
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```
