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
install dependencies    
```bash
cd backend
cp simple.env.example .env
yarn
```

create a sandbox in your [Mailgun account](https://help.mailgun.com/hc/en-us/sections/200437784-Getting-Started) for sending and receiving test emails         
pay attention to [Authorized Recipients](https://help.mailgun.com/hc/en-us/articles/217531258-Authorized-Recipients) section
and set mailgun env variables in `.env` accordingly    
```bash
EMAIL_MAILGUN_API_KEY=key-#############
EMAIL_MAILGUN_DOMAIN=sandbox################
```

start all system services (as configured in `.env` `STARTER_GLOB_PATTERN`)      
```bash
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
  accountSignUp(email:"youremail@yourdomain.com"){  # your email, configured in your mailgun sandbox
    success
    message
  }
}
```