#!/usr/bin/env node
// import boot from '../main/boot'
import { boot } from '../main/boot.mjs'
import { MainFolders } from '../types.mjs'

export default cli_boot

function cli_boot({ mainFolders }: { mainFolders: MainFolders }) {
  return boot({ mainFolders })
}
