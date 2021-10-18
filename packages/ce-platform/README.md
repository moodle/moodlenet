# MoodleNet CE Platform

## Quick start

### Prerequisites

#### Sharp package requirements

This sofware leverages [sharp](https://www.npmjs.com/package/sharp) for uploaded image processing

If you experience some weird issue on installation, you may want to [check out sharp system requisites](https://www.npmjs.com/package/sharp)

#### A running ArangoDB instance

the easiest way is using docker:

```sh
# start an ArangoDB instance
$ docker run -e ARANGO_NO_AUTH=1 --name mnarango -p 8529:8529 -d arangodb
```

#### install Moodlenet CE Platform globally

```sh
npm i -g @moodlenet/ce-platform
```

#### set environment variables

the easiest way is to make sure a `.env` file is present in start command working directory

```sh
# sample .env file

NODE_ENV=production
# DB
ARANGO_URL=http://localhost:8529

# HTTP config
HTTP_PORT=8080
DOMAIN=localhost:${HTTP_PORT}
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
STATICASSETS_FS_ROOT_FOLDER=/any/path/to/uploads/directory
```

#### Start Moodlenet CE Platform

start the platform using `npx`

```sh
# make sure env vars are set
# or a proper .env file is present in cwd
npx start-moodlenet-ce
```

only on first run the process populate the DB

HTTP server starts on 8080.

you can login as default admin with user="root@localhost:8080" and password="root",

browse your Moodlenet on page [http://localhost:8080/](http://localhost:8080/)

enjoy MoodleNet ;)
