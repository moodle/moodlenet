# MoodleNet system

## Dev Quick start

### Prerequisites

#### A running ArangoDB instance

the easiest way is using docker:

```sh
# start an ArangoDB instance
docker run -e ARANGO_NO_AUTH=1 --name mnarango -p 8529:8529 -d arangodb
```

#### Clone project

```sh
# clone repo
git clone https://gitlab.com/moodlenet/moodlenet.git

# step in root dir
cd moodlenet/
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
PUBLIC_URL=http://localhost:3000


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
STATICASSETS_FS_ROOT_FOLDER=$HOME/MN-FS-STATIC-ASSET
```

### Setup

#### Build and setup

```sh
# root deps
yarn

# lerna bootstrap: links and installs deps for packages
yarn bs

# install storybook
npx lerna add @types/storybook packages/webapp

# build packages
yarn build

# setup packages and dbs
yarn setup
# note you can set the env var flag `FORCE_DROP_DBS=true` to allow the script to drop system DBs if they already exist
```

#### Initial DB population

here's a tricky part for initial DBs population, until we get to a proper UX :

```sh
# enter backend package dir
cd packages/backend/

# start backend only
yarn start-dev
```

with backend process started on current terminal issue this command directly in the STDIN, to trigger initial DBs population:

```sh
qmino: command::my-moodlenet-backend::0.0.1::setup::initialContent##[{"domain":"moodlenet.dev"}]
```

and `enter`

after logging stops in a couple of seconds, `ctrl+c` for stopping process and back to project root for starting the system properly

```sh
# ctrl+c
# and back to project root dir
cd ../..
```

#### Start dev mode

```sh
# starts the backend as a monolith on port 8080, with in-process transport
# and starts the react app and serves on port 3000, binding localhost:8080 as backend url
yarn start-dev

# start storybook (optional)
cd packages/webapp/
yarn storybook
```

the HTTP backend starts on 8080 and web-app on 3000.

you can login as default admin with user="admin" and password="admin",

or you may want to signup as a new user on page `http://localhost:3000/signup`

enjoy MoodleNet ;)
