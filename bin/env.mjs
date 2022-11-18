import yargs from 'yargs'
import { resolve } from 'path'

export const yOpts = yargs(process.argv.slice(2)).argv
console.log({ yOpts })
export const { _, $0, ...restOpts } = yOpts
const [instdirname, ...rest_args] = _
export const opts = restOpts
export const opts_arr = Object.entries(restOpts).reduce((_, [k, v]) => {
  return v === true ? [..._, `--${k}`] : [..._, `--${k}`, `${v}`]
}, [])
export const args = rest_args.map(String)
export const moodlenetDevDir = resolve(process.cwd(), `.dev-machines`, String(instdirname))
// process.env.NODE_ENV = 'development'
