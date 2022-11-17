#!/usr/bin/env node

import yargs from 'yargs'
import { mkdir } from 'fs/promises'
import { resolve } from 'path'
import rimraf from 'rimraf'

const opts = yargs(process.argv.slice(2)).argv

const [instdirname] = opts._

process.env.NODE_ENV = 'development'
process.env.MOODLENET_CORE_WORKING_DIR = resolve(
  process.cwd(),
  `.dev-machines`,
  String(instdirname),
)
if (opts.clean) {
  rimraf.sync(process.env.MOODLENET_CORE_WORKING_DIR)
}
if (opts.reg) {
  if (typeof opts.reg === 'string') {
    process.env.npm_config_registry = opts.reg
  }
} else {
  process.env.USE_LOCAL_REPO = true
}

await mkdir(process.env.MOODLENET_CORE_WORKING_DIR, { recursive: true })
await import('../packages/core/lib/main/install.mjs')
