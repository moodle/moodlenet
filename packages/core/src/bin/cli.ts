#!/usr/bin/env node
import { resolve } from 'path'
// import boot from '../main/boot'
import install from '../main/install'
import { INSTALLED_PKGS_FOLDER_NAME, SYS_CONFIG_FILE_NAME } from '../main/prepareFileSystem'
import { MainFolders } from '../types/sys'
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
  const DEV_MODE_VALUE = 'development'
  const NODE_ENV = process.env.NODE_ENV ?? DEV_MODE_VALUE
  const devMode = NODE_ENV === DEV_MODE_VALUE
  const coreInstallationFolder = require(resolve(systemFolder, SYS_CONFIG_FILE_NAME)).core.installationFolder as string
  const bootModule = require(resolve(
    deploymentFolder,
    INSTALLED_PKGS_FOLDER_NAME,
    coreInstallationFolder,
    'lib',
    'main',
    'boot.js',
  ))
  bootModule.default({ mainFolders: mainFolders, devMode: devMode })
} else if (cmd === 'install') {
  install({ mainFolders })
} else {
  throw new Error(`no valid cmd:${cmd}`)
}
