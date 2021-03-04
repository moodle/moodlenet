require('./dotenv')
const glob = require('glob')

const globPattern = process.env.STARTER_GLOB_PATTERN
if (!globPattern) {
  throw new Error('needs STARTER_GLOB_PATTERN environment var')
} else {
  glob(globPattern, { cwd: 'src', dot: true }, (err, matches) => {
    if (err) {
      throw new Error(String(err))
    }
    console.log('starting', matches)
    matches.forEach(_ => require(`./src/${_}`))
  })
}
//console.log = () => { }