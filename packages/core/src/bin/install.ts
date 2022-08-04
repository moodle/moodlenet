#!/usr/bin/env node
// import boot from '../main/boot'
import prompts from 'prompts'
import install from '../main/install'
import { MainFolders } from '../types'

export default cli_install

async function cli_install({ mainFolders }: { mainFolders: MainFolders }) {
  const { 'http-port': httpPort } = await prompts([
    {
      type: 'number',
      initial: 8080,
      name: 'http-port',
      message: `http port?`,
    },
  ])
  return install({ mainFolders, httpPort })
}
