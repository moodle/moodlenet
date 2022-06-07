#!/usr/bin/env node
import { resolve } from 'path'
import { boot } from '../boot'
import { install } from '../install'

const [cmd, _deploymentFolder] = process.argv.slice(2)
const deploymentFolder = _deploymentFolder ? resolve(process.cwd(), _deploymentFolder) : process.cwd()
console.log({ cmd, deploymentFolder })
if (cmd === 'boot') {
  boot({ deploymentFolder })
} else if (cmd === 'install') {
  install({ installFolder: deploymentFolder, _DEV_MODE_CORE_PKGS_FROM_FOLDER: true })
} else {
  throw new Error(`no valid cmd:${cmd}`)
}
