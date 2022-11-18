#!/usr/bin/env node

import execa from 'execa'
import { moodlenetDevDir, args } from './env.mjs'

await execa('npm', ['start', '--', moodlenetDevDir, ...args], {
  cwd: moodlenetDevDir,
  stdout: process.stdout,
})
