import { main } from '@moodlenet/core'
import { existsSync, lstatSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import prompt from 'prompt'
import { sync as rimrafSync } from 'rimraf'

process.env.NODE_ENV = 'development'

const RESTART_EXIT_CODE = 9999
const DEPLOYMENTS_FOLDER_BASE = path.resolve(__dirname, '..', '.machines')
const LAST_DEPLOYMENT_FOLDERNAME_FILE = path.resolve(DEPLOYMENTS_FOLDER_BASE, '.LAST_DEPLOYMENT_FOLDER')
const DEV_LOCK_FILE = path.resolve(DEPLOYMENTS_FOLDER_BASE, '.DEV_LOCK_FILE')

const lastDeploymentFolderName = (() => {
  try {
    return readFileSync(LAST_DEPLOYMENT_FOLDERNAME_FILE, { encoding: 'utf-8' })
  } catch {
    return ''
  }
})()
const hasLock = existsSync(DEV_LOCK_FILE)

writeFileSync(DEV_LOCK_FILE, '')

prompt.start()
;(async () => {
  // let __rest = false
  process.on('message', message => {
    console.log(`Restarting... ${message}`)
    process.exit(RESTART_EXIT_CODE)
  })
  process.on('exit', code => {
    if (code !== RESTART_EXIT_CODE) {
      console.log('#### EXIT ####')
      rimrafSync(DEV_LOCK_FILE, { disableGlob: true })
    }
  })

  console.log({ hasLock, lastDeploymentFolderName })
  const deploymentFolderName =
    hasLock && lastDeploymentFolderName
      ? lastDeploymentFolderName
      : ((
          await prompt
            .get([
              {
                default: lastDeploymentFolderName,
                type: 'string',
                description: 'deployment folder',
                name: 'deploymentFolderName',
              },
            ])
            .catch(() => process.exit())
        ).deploymentFolderName as string)

  const deploymentFolder = path.resolve(DEPLOYMENTS_FOLDER_BASE, deploymentFolderName)

  console.log({ deploymentFolder })
  const deploymentFolderPathExists = existsSync(deploymentFolder)
  if (!deploymentFolderPathExists) {
    mkdirSync(deploymentFolder, { recursive: true })
  } else {
    const deploymentFolderPathIsDir = lstatSync(deploymentFolder).isDirectory()
    if (!deploymentFolderPathIsDir) {
      throw new Error(`${deploymentFolder} is not a dir`)
    }
  }

  if (lastDeploymentFolderName !== deploymentFolderName) {
    writeFileSync(LAST_DEPLOYMENT_FOLDERNAME_FILE, deploymentFolderName)
  }
  const folders = main.prepareFolders({
    deployment: deploymentFolder,
  })

  const initResponse = await main.install({
    folders,
    _DEV_MODE_CORE_PKGS_FROM_FOLDER: true,
  })

  console.log('init response:', initResponse)
  main.boot({ folders, devMode: true })
})()
