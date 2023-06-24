#!/usr/bin/env node

import { execa } from 'execa'
import {
  configJsonFilename,
  crypto,
  installDir,
  myPkgJson /* devInstallLocalRepoSymlinks */,
} from './env.mjs'
import './generate-files/main.mjs'

console.log(`
installing moodlenet@${myPkgJson.version} core packages in ${installDir}
may take some time...
`)

await execa('npx', ['-y', 'npm@8', 'install'], {
  cwd: installDir,
  stdout: process.stdout,
}).catch(err => {
  console.error(`install error`, err)
  process.exit(1)
})

console.log(`
installed Moodlenet${myPkgJson.version} in directory:\`${installDir}\`

generated crypto-keys files 
  private:\`${crypto.defaultKeyFilenames.private}\` 
  public:\`${crypto.defaultKeyFilenames.public}\`

system config-file:\`${configJsonFilename}\`

have fun with moodlenet!
`)

process.exit(0)
