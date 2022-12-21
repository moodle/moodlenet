#!/usr/bin/env node

import execa from 'execa'
import { cp } from 'fs/promises'
import { resolve } from 'path'
import { installDir, myPkgJson /* devInstallLocalRepoSymlinks */ } from './env.mjs'
import './package.json.mjs'
import './config.mjs'

console.log(`
installing moodlenet@${myPkgJson.version} core packages in ${installDir}
may take some time...
`)

await cp(resolve('bin', 'install-modules', 'start.mjs'), resolve(installDir, 'start.mjs'))
await cp(resolve('bin', 'install-modules', 'ignitor.mjs'), resolve(installDir, 'ignitor.mjs'))

await execa('npm', ['install'], {
  cwd: installDir,
  stdout: process.stdout,
})

process.exit(0)
