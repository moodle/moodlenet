// TODO: implement all services with no in-code-env-vars-defaults
// define a git-tracked .defaults.env with *all* defaultable env vars with docs
// try to find a way for workers-implementations to define their own .defaults.env too, and be loaded in some way at start

const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')

const myEnv = dotenv.config()
dotenvExpand(myEnv)
