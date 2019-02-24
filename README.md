[![Build Status](https://travis-ci.org/delta62/oscar-api.svg?branch=master)](https://travis-ci.org/delta62/oscar-api)

# Oscar API

[![Greenkeeper badge](https://badges.greenkeeper.io/delta62/oscar-api.svg)](https://greenkeeper.io/)

API server for an Oscars trivia game

## Running

#### Docker

You need to provide configuration settings to run from docker:

``` bash
docker run delta62/oscar-api -e 'NODE_CONFIG={"db.host":"localhost"...}'
```

But you probably just want to use the [oscar-dev](https://github.com/delta62/oscar-dev)
repository in this case; it sets all this junk up for you.

#### Locally

First, install NPM packages with `yarn`. Then, `yarn start` will start the server.
You can do `yarn test` to run the tests.

## Configuration

Configuration is handled by [config](https://www.npmjs.com/package/config).
The following configuration options are available:

| Name             | Type     | Description                                               |
| ---------------- | -------- | --------------------------------------------------------- |
| cors.origins     | string[] | An array of origins allowed for CORS requests             |
| db.host          | string   | Hostname of the mongo database server                     |
| db.port          | number   | Port of the mongo database server                         |
| db.dp            | string   | Database name to use                                      |
| auth.secret      | string   | The key to sign auth tokens with                          |
| auth.admins      | string[] | An array of usernames that should be treated as admins    |
| score.correct    | number   | The number of points awarded for a corect answer          |
| score.incorrect  | number   | The number of points awarded for an incorrect answer      |
| score.first      | number   | The number of points awarded for the first correct answer |
| score.beforeShow | number   | The number of points awareded for correct answers submitted before the show begins |
| score.showStart  | number   | The timestamp at which the show starts                    |
| log.level        | string   | How noisy the logs should be                              |
| mail             | object   | A NodeMailer SMTP transport configuration object          |

## API Documentation

https://app.swaggerhub.com/api/delta62/oscars-api/0.0.1
