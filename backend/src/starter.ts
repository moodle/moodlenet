import glob from 'glob'

const globPattern = process.env.STERTER_GLOB_PATTERN
if (!globPattern) {
  throwError('needs STERTER_GLOB_PATTERN environment var')
} else {
  glob(globPattern, {}, (err, matches) => (err ? throwError(err) : matches.forEach(require)))
}

function throwError(_: any) {
  throw new Error(_)
}
