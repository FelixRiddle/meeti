# Meeti

Meetup clone

# Setup

These are the setup steps

## Dependency

Like 'dev-jobs' it's required to build and put the distribution files of the following packages:

- Leaflet 1.9.4
- Trix 2.1.1

Their directories have to be placed at: public/package/PACKAGE_NAME@PACKAGE_VERSION/dist

For example for trix: public/package/trix@2.1.1/dist

## Environment variables

These are the environment variables that can be configured.

```
# App configuration
# Don't use mail in the app
DISABLE_MAIL=

# Server configuration
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
