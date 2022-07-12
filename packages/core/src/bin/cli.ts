#!/usr/bin/env node
import { resolve } from 'path'
import boot from '../main/boot'
import install from '../main/install'
import { MainFolders } from '../types/sys'
const [cmd, _deploymentFolder] = process.argv.slice(2)
const deploymentFolder = _deploymentFolder ? resolve(process.cwd(), _deploymentFolder) : process.cwd()
const systemFolder = deploymentFolder ?? resolve(deploymentFolder, '_system')

const mainFolders: MainFolders = {
  deploymentFolder,
  systemFolder,
}
console.log({ cmd, deploymentFolder })
if (cmd === 'boot') {
  const DEV_MODE_VALUE = 'development'
  const NODE_ENV = process.env.NODE_ENV ?? DEV_MODE_VALUE
  const devMode = NODE_ENV === DEV_MODE_VALUE

  boot({ mainFolders, devMode })
} else if (cmd === 'install') {
  install({ mainFolders })
} else {
  throw new Error(`no valid cmd:${cmd}`)
}
