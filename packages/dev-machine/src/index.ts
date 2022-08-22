import { boot, install, InstallPkgReq, MainFolders } from '@moodlenet/core'
import { defaultCorePackages } from '@moodlenet/core/lib/main/install'
import { existsSync, lstatSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { readFile } from 'fs/promises'
import path, { resolve } from 'path'
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
  const systemFolder = resolve(deploymentFolder, '_system')

  const mainFolders: MainFolders = {
    deploymentFolder,
    systemFolder,
    pkgStorageFolder: resolve(__dirname, '..', '..'),
  }
  console.log({ deploymentFolder })
  const deploymentFolderPathExists = existsSync(deploymentFolder)
  if (!deploymentFolderPathExists) {
    const customEnvName = (
      await prompt
        .get([
          {
            default: '',
            type: 'string',
            description: 'custom env property ?',
            name: 'customEnvName',
          },
        ])
        .catch(() => process.exit())
    ).customEnvName as string
    const defaultPkgEnv = await getDefaultPkgEnv(customEnvName)

    mkdirSync(deploymentFolder, { recursive: true })
    const installPkgReqs = Object.keys(defaultCorePackages)
      .map(dirName => resolve(__dirname, '..', '..', dirName))
      .map<InstallPkgReq>(fromFolder => ({
        type: 'symlink',
        fromFolder,
      }))
    await install({
      mainFolders,
      installPkgReqs,
      defaultPkgEnv,
    })
  } else {
    const deploymentFolderPathIsDir = lstatSync(deploymentFolder).isDirectory()
    if (!deploymentFolderPathIsDir) {
      throw new Error(`${deploymentFolder} is not a dir`)
    }
  }

  if (lastDeploymentFolderName !== deploymentFolderName) {
    writeFileSync(LAST_DEPLOYMENT_FOLDERNAME_FILE, deploymentFolderName)
  }

  await boot({ mainFolders, devMode: true })
  writeFileSync(DEV_LOCK_FILE, '')

  async function getDefaultPkgEnv(customEnvName: string) {
    let customEnv: any = undefined
    const customPkgEnvFileStr = await readFile('./pkg-envs.json', { encoding: 'utf-8' }).catch(() => '{}')
    try {
      const customEnvsMap = JSON.parse(customPkgEnvFileStr)
      customEnv = customEnvsMap[customEnvName]
    } catch {
      console.error('pkg-envs.json unparseable json')
      process.exit()
    }

    return (pkgName: string) => {
      const defEnvs = {
        '@moodlenet/http-server': { port: 8080 },
        '@moodlenet/arangodb': { connectionCfg: { url: 'http://localhost:8529' } },
        '@moodlenet/authentication-manager': { rootPassword: 'root' },
        '@moodlenet/email-service': {
          mailerCfg: { transport: { jsonTransport: true }, defaultFrom: 'noreply@moodlenet.local' },
        },
        ...customEnv,
      }
      return defEnvs[pkgName]
    }
  }
})()
