#!/usr/bin/env node

import yargs from 'yargs'
import { resolve } from 'path'

const opts = yargs(process.argv.slice(2)).argv
const [instdirname] = opts._

process.env.NODE_ENV = 'development'
process.env.MOODLENET_CORE_WORKING_DIR = resolve(
  process.cwd(),
  `.dev-machines`,
  String(instdirname),
)

if (opts.reg) {
  process.env.npm_config_registry = opts.reg
}
await import('../packages/core/lib/main/boot.mjs')
