#!/usr/bin/env node

import { execa } from 'execa'
import { fwRestArgs, fwRestOpts, mnDevDir, nodeDev } from './env.mjs'

const noNodeDev = !(nodeDev ?? true)
// console.log({ fwRestOpts })
/** @type {import('execa').Options} */
const execaOpts = {
  cwd: mnDevDir,
  stdout: process.stdout,
  stderr: process.stderr,
  stdin: process.stdin,
  env: {
    MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES: 'true',
    NODE_ENV: 'development',
  },
}

if (noNodeDev) {
  console.log(`starting with node`)
  await execa('node', ['start.mjs', '--', ...fwRestOpts, ...fwRestArgs], execaOpts)
} else {
  console.log(`starting with node-dev`)
  await execa(
    'npx',
    [
      '-y',
      'node-dev',
      '--debounce',
      '2000',
      '--notify',
      'false',
      'start.mjs',
      '--',
      ...fwRestOpts,
      ...fwRestArgs,
    ],
    execaOpts,
  )
}
