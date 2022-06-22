#!/usr/bin/env node
import { resolve } from 'path'
import boot from '../main/boot'
import install from '../main/install'
import prepareFolders from '../main/prepareFolders'
const [cmd, _deploymentFolder] = process.argv.slice(2)
const deploymentFolder = _deploymentFolder ? resolve(process.cwd(), _deploymentFolder) : process.cwd()
const folders = prepareFolders({ deployment: deploymentFolder })
const registry = process.env.npm_config_registry
console.log({ registry, cmd, deploymentFolder })
if (cmd === 'boot') {
  const DEV_MODE_VALUE = 'development'
  const NODE_ENV = process.env.NODE_ENV ?? DEV_MODE_VALUE
  const devMode = NODE_ENV === DEV_MODE_VALUE

  boot({ folders, devMode })
} else if (cmd === 'install') {
  install({
    folders,
    registry,
    _DEV_MODE_CORE_PKGS_FROM_FOLDER: process.env._DEV_MODE_CORE_PKGS_FROM_FOLDER === '_DEV_MODE_CORE_PKGS_FROM_FOLDER',
  })
} else {
  throw new Error(`no valid cmd:${cmd}`)
}
