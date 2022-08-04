#!/usr/bin/env node
// import boot from '../main/boot'
import boot from '../main/boot'
import { MainFolders } from '../types'

export default cli_boot

function cli_boot({ mainFolders }: { mainFolders: MainFolders }) {
  const DEV_MODE_VALUE = 'development'
  const NODE_ENV = process.env.NODE_ENV ?? DEV_MODE_VALUE
  const devMode = NODE_ENV === DEV_MODE_VALUE
  return boot({ mainFolders, devMode })
}
