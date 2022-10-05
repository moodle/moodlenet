#!/usr/bin/env node
import { resolve } from 'path'
import prompts from 'prompts'
// import boot from '../main/boot'
import yargs from 'yargs'
import { MainFolders } from '../types.mjs'
import boot from './boot.mjs'
import install from './install.mjs'
prompts.override((yargs as any).argv)
;(async () => {
  const params = await prompts([
    {
      type: 'select',
      choices: [
        { title: 'install', value: 'install' },
        { title: 'boot', value: 'boot' },
      ],
      name: 'operation',
      message: `operation?`,
    },
    {
      type: 'text',
      name: 'installation-folder',
      message: `installation folder?`,
      initial: process.cwd(),
      format: installation_folder => resolve(process.cwd(), installation_folder ?? '.'),
    },
    {
      type: 'text',
      name: 'system-folder',
      message: `system folder?`,
      initial: deploymentFolder => resolve(deploymentFolder, '_system'),
      format: (system_folder, values) =>
        system_folder ? resolve(process.cwd(), system_folder) : resolve(values['installation-folder'], '_system'),
    },
  ])
  const { operation, 'installation-folder': installation_folder, 'system-folder': system_folder } = params
  const mainFolders: MainFolders = {
    deploymentFolder: installation_folder,
    systemFolder: system_folder,
  }
  if (operation === 'boot') {
    boot({ mainFolders })
  } else if (operation === 'install') {
    install({ mainFolders })
  } else {
    throw new Error(`no valid operation:${operation}`)
  }
})()
