import yargs from 'yargs'
import { resolve } from 'path'

export const yOpts = yargs(process.argv.slice(2)).argv
export const { _, $0, ...restOpts } = yOpts
const [mnDevDirOpt, ...restArgs] = _
export const fwRestOpts = Object.entries(restOpts).reduce((_, [k, v]) => {
  return v === true ? [..._, `--${k}`] : [..._, `--${k}`, `${v}`]
}, [])
export const fwRestArgs = restArgs.map(String)
export const mnDevDir = resolve(process.cwd(), `.dev-machines`, String(mnDevDirOpt))
// process.env.NODE_ENV = 'development'

console.log({
  mnDevDir,
  mnDevDirOpt,
  fwRestOpts,
  fwRestArgs,
  _,
  $0,
  yOpts,
  restOpts,
  restArgs,
})
