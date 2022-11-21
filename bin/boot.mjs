#!/usr/bin/env node

import execa from 'execa'
import { mnDevDir, fwRestOpts, fwRestArgs } from './env.mjs'

console.log({ fwRestOpts })
await execa('npm', ['start', '--', ...fwRestOpts, ...fwRestArgs], {
  cwd: mnDevDir,
  stdout: process.stdout,
})
