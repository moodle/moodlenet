const glob = require('glob')
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')

const myEnv = dotenv.config()
dotenvExpand(myEnv)

const globPattern = process.env.STARTER_GLOB_PATTERN
if (!globPattern) {
  throwError('needs STARTER_GLOB_PATTERN environment var')
} else {
  glob(globPattern, { cwd: 'js', dot: true, }, (err, matches) => (err ? throwError(err) : matches.forEach(_ => require(`./js/${_}`))))
}

function throwError(_) {
  throw new Error(_)
}
