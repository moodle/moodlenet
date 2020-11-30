# MoodleNet system

## Dev Quick start

### Setup

start an ArangoDB docker container

```bash
docker run -d --network=host --name=mnarango -e ARANGO_NO_AUTH=true  arangodb/arangodb
```

start an RabbitMQ docker container

```bash
docker run -d --network host  --name=mnrabbit rabbitmq:3-management
```

cd into backend folder  
create an `.env` file out of example  
install

```bash
cd backend
cp simple.env.example .env
yarn
```

the `simple.env.example` is configured to start all system services (see `STARTER_GLOB_PATTERN` env var)  
create a sandbox in your [Mailgun account](https://help.mailgun.com/hc/en-us/sections/200437784-Getting-Started) for sending and receiving test emails  
pay attention to [Authorized Recipients](https://help.mailgun.com/hc/en-us/articles/217531258-Authorized-Recipients) section  
and set mailgun env variables in `.env` accordingly

```bash
EMAIL_MAILGUN_API_KEY=key-#############
EMAIL_MAILGUN_DOMAIN=sandbox################
```

start system

```bash
yarn start
```

every other time you start system remember to start docker containers first  
if you didn't deleted them you can just

```bash
docker start mnrabbit mnarango
yarn start
```

### Web UIs

ArangoDB : http://localhost:8529/  
RabbitMQ : http://localhost:15672/ ( guest guest )  
GraphQL : http://localhost:8080/graphql/

### Issue some GraphQL requests

in GraphQL WebUI issue a signUp requests

```graphql
# Write your query or mutation here
mutation signup {
  # your email, should be one `Authorized Recipients` configured in your mailgun sandbox
  accountSignUp(email: "youremail@yourdomain.com") {
    success
    message
  }
}
```
