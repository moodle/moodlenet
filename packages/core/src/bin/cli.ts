#!/usr/bin/env node
import { resolve } from 'path'
// import boot from '../main/boot'
import { MainFolders } from '../types/sys'
import boot from './boot'
import install from './install'
const [cmd, _deploymentFolder, _systemFolder] = process.argv.slice(2)
const deploymentFolder = _deploymentFolder ? resolve(process.cwd(), _deploymentFolder) : process.cwd()
const systemFolder = _systemFolder ?? resolve(deploymentFolder, '_system')

const mainFolders: MainFolders = {
  deploymentFolder,
  systemFolder,
}
console.log({ _deploymentFolder, deploymentFolder, _systemFolder, systemFolder })
console.log({ cmd, deploymentFolder })
if (cmd === 'boot') {
  boot({ mainFolders })
} else if (cmd === 'install') {
  install({ mainFolders })
} else {
  throw new Error(`no valid cmd:${cmd}`)
}
