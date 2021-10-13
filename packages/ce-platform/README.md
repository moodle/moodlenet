# MoodleNet CE Platform

## Quick start

### Prerequisites

#### A running ArangoDB instance

the easiest way is using docker:

```sh
# start an ArangoDB instance
docker run -e ARANGO_NO_AUTH=1 --name mnarango -p 8529:8529 -d arangodb
```

#### install Moodlenet Platform globally

```sh
npm i -g @moodlenet/ce-platform
```

#### An .env file for backend

should be positioned in `./packages/backend/` and contain following env vars:

```sh
# this .env is ok for development env

NODE_ENV=development

# DB
ARANGO_URL=http://localhost:8529

# HTTP config
HTTP_PORT=8080
DOMAIN=localhost:8080
PUBLIC_URL=http://${DOMAIN}


# smtp url
SMTP=smtps://fullusername:password@smtp.domain.com/?pool=true
# will work with simple user:password authentication only
# fancier auth methods should be properly configured and hooked to ports
# if using gmail you need to set a full-user-name if email is not in gmail domain
# SMTP=smtps://fullusername:password@smtp.gmail.com/?pool=true
# and probably need to enable "less secure apps access"
# https://myaccount.google.com/lesssecureapps

# JWT config
JWT_EXPIRATION_SECS=36000
# ^ JWT keys with this format
# https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9#gistcomment-2932501
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n##<keyrows separated by \n>##\n-----END PUBLIC KEY-----"
JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n##<keyrows separated by \n>##\n-----END RSA PRIVATE KEY-----"
# $ JWT keys

# Folder to save content static assets (images, resources ..)
STATICASSETS_FS_ROOT_FOLDER=any/path/to/uploads/directory
```

#### Start

```sh
npx start-moodlenet-ce
```

the HTTP server starts on 8080.

you can login as default admin with user="root@localhost:8080" and password="root",

browse Moodlenet on page `http://localhost:8080/`

enjoy MoodleNet ;)
