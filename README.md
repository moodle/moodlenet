# MoodleNet system

## Dev Quick start 

start an ArangoDB docker container 
`docker run -d --network=host --name=mnarango -e ARANGO_NO_AUTH=true  arangodb/arangodb`

start an RabbitMQ docker container 
`docker run -d --network host  --name mnrabbit rabbitmq:3-management`

cd into backend folder
`cd backend`

create an `.env` file out of example 
`cp simple.env.example .env`

create a sandbox in your Mailgun account for receiving test emails     
and set mailgun env variables in `.env`
```
EMAIL_MAILGUN_API_KEY=key-#############
EMAIL_MAILGUN_DOMAIN=sandbox################
```

start system as a whole
`yarn start`

## Web UIs
ArangoDB : http://localhost:8529/

RabbitMQ : http://localhost:15672/ ( guest guest )

GraphQL : http://localhost:8080/graphql/ 

## Issue some GraphQL requests
in GraphQL WebUI issue a signUp requests
```
# Write your query or mutation here
mutation signup {
  accountSignUp(email:"youremail@yourdomain.com"){  # your email, configured in your mailgun sandbox
    success
    message
  }
}
```