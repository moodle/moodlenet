#!/usr/bin/env node

import execa from 'execa'
import { cp } from 'fs/promises'
import { resolve } from 'path'
import { installDir, myPkgJson /* devInstallLocalRepoSymlinks */ } from './env.mjs'
import './package.json.mjs'

console.log(`
installing moodlenet@${myPkgJson.version} core packages in ${installDir}
may take some time...
`)

await cp(resolve('bin', 'install-modules', 'start.mjs'), resolve(installDir, 'start.mjs'))
await cp(resolve('bin', 'install-modules', 'ignitor.mjs'), resolve(installDir, 'ignitor.mjs'))

await execa('npx', ['-y', 'npm@8', 'install'], {
  cwd: installDir,
  stdout: process.stdout,
}).catch(err => {
  console.error(`install error`, err)
  process.exit(1)
})

process.exit(0)
