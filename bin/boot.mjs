#!/usr/bin/env node

import execa from 'execa'
import { mnDevDir, fwRestOpts, fwRestArgs } from './env.mjs'

console.log({ fwRestOpts })
await execa('npx', ['-y', 'node-dev', 'start.mjs', '--', ...fwRestOpts, ...fwRestArgs], {
  cwd: mnDevDir,
  stdout: process.stdout,
  env: {
    MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES: 'true',
  },
})
