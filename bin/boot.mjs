#!/usr/bin/env node

import execa from 'execa'
import { moodlenetDevDir } from './env.mjs'

await execa('npm', ['start', '--', moodlenetDevDir], {
  cwd: moodlenetDevDir,
  stdout: process.stdout,
})
