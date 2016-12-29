[![Build Status](https://travis-ci.org/delta62/oscar-api.svg?branch=master)](https://travis-ci.org/delta62/oscar-api)

# Oscar API

API server for an Oscars trivia game

## Running

#### Docker

You need to provide configuration settings to run from docker:

``` bash
docker run delta62/oscar-api -e 'NODE_CONFIG={"db.host":"localhost"...}'
```

#### Locally

First, install NPM packages with `yarn`. Then, `yarn start` will start the server.
You can run `yarn test` to run the tests.

## Configuration

Configuration is handled by [config](https://www.npmjs.com/package/config).
The following configuration options are available:

| Name            | Description                                            |
| --------------- | ------------------------------------------------------ |
| db.host         | hostname of the mongo database server                  |
| db.port         | port of the mongo database server                      |
| db.dp           | database name to use                                   |
| auth.secret     | The key to sign auth tokens with                       |
| auth.admins     | An array of usernames that should be treated as admins |
| score.correct   | The number of points awarded for a corect answer       |
| score.incorrect | The number of points awarded for an incorrect answer   |
| log.level       | How noisy the logs should be                           |

## API Documentation

https://app.swaggerhub.com/api/delta62/oscars-api/0.0.1
