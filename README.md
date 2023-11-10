># SpotIn Server
This used to be the server of [Spotin App](https://github.com/Guarrakesh/spotinapp), written in JS with Node and Express. It consistes of an authenticated API layer (REST & GraphQL) and some interesting feature like the [Sports Events Appeal evaluator system](https://github.com/Guarrakesh/spotin-server/tree/master/src/api/models/appeal).
## Docker

```bash
# run container locally
yarn docker:dev
or
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# run container in production
yarn docker:prod
or
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

# run tests
yarn docker:test
or
docker-compose -f docker-compose.yml -f docker-compose.test.yml up
```

## Deploy

Set your server ip:

```bash
DEPLOY_SERVER=127.0.0.1
```

Replace my Docker username with yours:

```bash
nano deploy.sh
```

Run deploy script:

```bash
yarn deploy
or
sh ./deploy.sh
```
