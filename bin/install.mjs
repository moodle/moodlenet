#!/usr/bin/env node

import { resolve } from 'path'
import rimraf from 'rimraf'
import execa from 'execa'
import { moodlenetDevDir, opts, args } from './env.mjs'

if (opts.clean) {
  rimraf.sync(moodlenetDevDir)
}

console.log(`installing dev in ${moodlenetDevDir}`, { args, opts })
await execa('npm', ['start', '--', moodlenetDevDir, '--dev-install-local-repo-symlinks', ...args], {
  cwd: resolve(process.cwd(), 'packages', 'create-moodlenet'),
  timeout: 600000,
  stdout: process.stdout,
})

// await execa(
//   'npm',
//   ['pkg', 'set', `scripts.start=pm2 restart --force --name xx --watch --update-env --attach --env development moodlenet.config.js`],
//   {
//     cwd: moodlenetDevDir,
//     stdout: process.stdout,
//   },
// )
