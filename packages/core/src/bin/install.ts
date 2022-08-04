#!/usr/bin/env node
// import boot from '../main/boot'
import install from '../main/install'
import { MainFolders } from '../types'

export default cli_install

function cli_install({ mainFolders }: { mainFolders: MainFolders }) {
  return install({ mainFolders })
}
