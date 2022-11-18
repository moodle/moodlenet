#!/usr/bin/env node

import { resolve } from 'path'
import rimraf from 'rimraf'
import execa from 'execa'
import { mnDevDir, restOpts, fwRestArgs } from './env.mjs'

if (restOpts.clean) {
  rimraf.sync(mnDevDir)
}

console.log(`installing dev in ${mnDevDir}`, { fwRestArgs, restOpts })
await execa('npm', ['start', '--', mnDevDir, '--dev-install-local-repo-symlinks', ...fwRestArgs], {
  cwd: resolve(process.cwd(), 'packages', 'create-moodlenet'),
  timeout: 600000,
  stdout: process.stdout,
})

// await execa(
//   'npm',
//   ['pkg', 'set', `scripts.start=pm2 restart --force --name xx --watch --update-env --attach --env development moodlenet.config.js`],
//   {
//     cwd: mnDevDir,
//     stdout: process.stdout,
//   },
// )
