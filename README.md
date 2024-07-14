# Meeti

Meetup clone

# Setup

These are the setup steps

<!-- In the tutorial PostGis is used, but it doesn't works for me, so I don't use it -->

## Manually installing dependencies(Required)

The reason for doing it this way is because styles are not imported from Javascript, and neither are the images.

Their directories have to be placed at: public/package/PACKAGE_NAME@PACKAGE_VERSION/dist

For example for trix: public/package/trix@2.1.1/dist

In public/package you will have the following folders with packages data

```
leaflet-geosearch@4.0.0
leaflet@1.9.4
trix@2.1.1
```

## Environment variables

These are the environment variables that can be configured.

```
# App configuration
# Don't use mail in the app
DISABLE_MAIL=
# Email sender / App main mail user
SERVICE_EMAIL=
# Frontend url
FRONTEND_URL=

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
