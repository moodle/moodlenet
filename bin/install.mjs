#!/usr/bin/env node

import { resolve } from 'path'
import rimraf from 'rimraf'
import execa from 'execa'
import { clean, moodlenetDevDir, useRegistry } from './env.mjs'

if (clean) {
  rimraf.sync(moodlenetDevDir)
}

const opts = useRegistry ? [] : ['--dev-install-local-repo-symlinks']

console.log(`installing dev in ${moodlenetDevDir}`, { opts })
await execa('npm', ['start', '--', moodlenetDevDir, ...opts], {
  cwd: resolve(process.cwd(), 'packages', 'create-moodlenet'),
  timeout: 600000,
  stdout: process.stdout,
})
