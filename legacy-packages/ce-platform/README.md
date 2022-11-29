# MoodleNet CE Platform

## System Requirements

### NodeJs

This software runs on [nodejs](https://nodejs.org/) `>=14.14.0`.

### Sharp package requirements

This sofware leverages [sharp](https://www.npmjs.com/package/sharp) for uploaded image processing

The docs states that

> Most modern macOS, Windows and Linux systems running Node.js >= 12.13.0 do not require any additional install or runtime dependencies.

However, if you experience issues on installation or on upload functionalities, you may want to [check out sharp system requisites](https://github.com/lovell/sharp/tree/master/docs)

### A running ArangoDB instance

the easiest way is using docker:

```sh
# start an ArangoDB instance
$ docker run -e ARANGO_NO_AUTH=1 --name mnarango -p 8529:8529 -d arangodb
```

## Quick start

### install Moodlenet CE Platform globally

```sh
npm i -g @moodlenet/ce-platform
```

### set environment variables

MoodleNet needs a bunch of environment variable set for nodejs process

[dotenv](https://www.npmjs.com/package/dotenv) and [dotenv-expand](https://www.npmjs.com/package/dotenv-expand) are supported, so the easiest way is to make sure a proper `.env` file is present in process working directory

```sh
# sample .env file

NODE_ENV=development

# DB
ARANGO_URL=http://localhost:8529

# ^HTTP config
#
HTTP_PORT=8080
PUBLIC_URL_PROTOCOL=http
#
# $HTTP config

# Webapp config
REACT_APP_CUSTOM_HEAD="<script>console.log('this env var string will be embedded as-is in HTML>HEAD')</script>"

# smtp url
#
# will work with simple user:password authentication only
# if using gmail you need to set a full-user-name if email is not in gmail domain
# SMTP=smtps://fullusername:password@smtp.gmail.com/?pool=true
# and probably need to enable "less secure apps access"
# https://myaccount.google.com/lesssecureapps
SMTP=smtps://fullusername:password@smtp.domain.com/?pool=true

# ^ CRYPTO config
#
# RSA keys
# https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9#gistcomment-2932501
CRYPTO_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n##<keyrows separated by \n>##\n-----END PUBLIC KEY-----"
CRYPTO_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n##<keyrows separated by \n>##\n-----END RSA PRIVATE KEY-----"
#
# $ CRYPTO keys

# Folder to save content static assets (images, resources ..)
STATICASSETS_FS_ROOT_FOLDER=/any/path/to/uploads/directory
# Max upload size in bytes - applies to images and resources
ASSET_UPLOADER_MAX_SIZE=10485760 # 10MB

#^SETUP VARS
#

# the following variables are necessary on first run as they will be used for initial DB population
# *** _all_ SETUP_* variables are mandatory for a correct installation ***
# they aren't required for subsequent system starts, though

# the domain hosting your MoodleNet installation
# in real world deployment would be something like: SETUP_ORGANIZATION_DOMAIN=my.example.domain.com
SETUP_ORGANIZATION_DOMAIN=localhost:${HTTP_PORT}

# an accessible email for the "organization user"
# super-admin will use this for authenticating as org-user
SETUP_ORGANIZATION_EMAIL=your.org.user@email.com

# following vars are used to fill the DB with your organization info,
# displayed in various contexts, from webapp to email notifications
SETUP_ORGANIZATION_NAME=My Awesome Organization
SETUP_ORGANIZATION_DESCRIPTION="My organization description\nmultiline"
SETUP_ORGANIZATION_SUBTITLE=My organization subtitle
# logos point to accessible images of any browser-supported mimetype
SETUP_ORGANIZATION_LOGO=https://url-to.any/logo.png
SETUP_ORGANIZATION_SMALL_LOGO=https://url-to.any/small-logo.svg
# whether a newly signed up user is marked as published or not [true|false]
SETUP_2_0_1_NEW_USER_PUBLISHED=true 
#
#$SETUP VARS
```

### Start Moodlenet CE Platform

start the platform using `npx`

```sh
# make sure env vars are set or a proper .env file is present in cwd
npx start-moodlenet-ce
```

Only on first run the process populates the DB, and use the `^SETUP VARS` section of env variables

HTTP server starts on 8080.

Browse your MoodleNet @ [http://localhost:8080/](http://localhost:8080/) enjoy MoodleNet ;)

## Organization User

On first run, the organization user is ceated bound to `SETUP_ORGANIZATION_EMAIL` and without any valid password set.

You can perform your first login as org-user by the recover password workflow, clicking `[or recover password]` link in login page

Follow the instructions you'll receive @`SETUP_ORGANIZATION_EMAIL`, and choose a password for org-user

Subsequent logins, you can fill in the login form with `SETUP_ORGANIZATION_EMAIL` and the choosen password
