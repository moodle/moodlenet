import yargs from 'yargs'
import { resolve } from 'path'

const opts = yargs(process.argv.slice(2)).argv
const [instdirname] = opts._

export const moodlenetDevDir = resolve(process.cwd(), `.dev-machines`, String(instdirname))
export const clean = !!opts.clean
export const registry = opts.registry ? String(opts.registry) : undefined
export const useRegistry = opts['use-reg'] === true

process.env.NODE_ENV = 'development'
registry && (process.env.npm_config_registry = registry)

// console.log({
//   moodlenetDevDir,
//   clean,
//   registry,
//   useRegistry,
// })
