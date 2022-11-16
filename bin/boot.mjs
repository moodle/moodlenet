#!/usr/bin/env node

import execa from 'execa'
import { moodlenetDevDir } from './env.mjs'
import yargs from 'yargs'
const opts = await yargs(process.argv.slice(2))
const argv = await opts.argv

await execa(
  'npm',
  ['start', '--', moodlenetDevDir, ...(argv.forever === true ? ['--forever'] : [])],
  {
    cwd: moodlenetDevDir,
    stdout: process.stdout,
  },
)
