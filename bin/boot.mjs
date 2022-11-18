#!/usr/bin/env node

import execa from 'execa'
import { moodlenetDevDir, opts_arr } from './env.mjs'

console.log({ opts_arr })
await execa('npm', ['start' /* moodlenetDevDir, */, '--', ...opts_arr], {
  cwd: moodlenetDevDir,
  stdout: process.stdout,
})
