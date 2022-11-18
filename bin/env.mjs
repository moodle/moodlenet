import yargs from 'yargs'
import { resolve } from 'path'

export const opts = yargs(process.argv.slice(2)).argv
const [instdirname, ...rest_args] = opts._
export const args = rest_args.map(String)
export const moodlenetDevDir = resolve(process.cwd(), `.dev-machines`, String(instdirname))
process.env.NODE_ENV = 'development'
