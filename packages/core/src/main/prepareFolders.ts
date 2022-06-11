import { existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { MainFolders } from '../types/sys'

export default function prepareFolders(folders?: Partial<MainFolders>): MainFolders {
  const deploymentFolder = folders?.deployment ?? process.cwd()
  const sysFolder = folders?.system ?? resolve(deploymentFolder, '_system')
  const mainFolders: MainFolders = { deployment: deploymentFolder, system: sysFolder }
  console.log({ mainFolders })
  if (!folders?.system) {
    const exists = existsSync(mainFolders.system)
    !exists && mkdirSync(mainFolders.system)
  }
  return mainFolders
}
