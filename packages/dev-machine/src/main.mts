import { cfgResolver, InstallPkgReq, MainFolders } from '@moodlenet/core/lib/main.mjs'
import { boot } from '@moodlenet/core/lib/main/boot.mjs'
import { defaultCorePackages, install } from '@moodlenet/core/lib/main/install.mjs'
import { existsSync, lstatSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import path, { resolve } from 'path'
import prompts from 'prompts'
import rimraf from 'rimraf'
import { fileURLToPath } from 'url'

process.env.NODE_ENV = 'development'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

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

;(async () => {
  // let __rest = false
  process.on('message', message => {
    console.log(`Restarting... ${message}`)
    process.exit(RESTART_EXIT_CODE)
  })
  process.on('exit', code => {
    if (code !== RESTART_EXIT_CODE) {
      console.log('#### EXIT ####')
      rimraf.sync(DEV_LOCK_FILE, { disableGlob: true })
    }
  })

  console.log({ hasLock, lastDeploymentFolderName })
  const deploymentFolderName =
    hasLock && lastDeploymentFolderName
      ? lastDeploymentFolderName
      : (
          await prompts([
            {
              type: 'text',
              initial: lastDeploymentFolderName,
              message: 'deployment folder',
              name: 'deploymentFolderName',
            },
          ])
        ).deploymentFolderName

  const deploymentFolder = path.resolve(DEPLOYMENTS_FOLDER_BASE, deploymentFolderName)
  const systemFolder = resolve(deploymentFolder, '_system')

  const mainFolders: MainFolders = {
    deploymentFolder,
    systemFolder,
    pkgStorageFolder: resolve(__dirname, '..', '..'),
  }
  console.log({ deploymentFolder })
  const deploymentFolderPathExists = existsSync(deploymentFolder)
  // console.log({ customPkgEnvs: Object.keys(customPkgEnvs) })
  if (!deploymentFolderPathExists) {
    const customPkgEnvs = getCustomPkgEnvs()

    const { customEnvName } = customPkgEnvs
      ? await prompts([
          {
            choices: Object.keys(customPkgEnvs).map<prompts.Choice>(title => ({
              title: title,
              value: title,
              selected: title === 'default',
            })),
            type: 'select',
            message: 'custom env property ?',
            name: 'customEnvName',
          },
        ])
      : { customEnvName: '' }
    const defaultPkgEnv = await getDefaultPkgEnvFn(customPkgEnvs ?? {}, customEnvName)
    // console.log({ defaultPkgEnv })

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

  cfgResolver.resolve({ mainFolders })
  await boot()
  writeFileSync(DEV_LOCK_FILE, '')

  function getCustomPkgEnvs(): any {
    try {
      const customPkgEnvFileStr = readFileSync('./pkg-envs.json', { encoding: 'utf-8' })
      try {
        return JSON.parse(customPkgEnvFileStr)
      } catch {
        console.error('pkg-envs.json unparseable json')
        process.exit()
      }
    } catch {
      return null
    }
  }

  async function getDefaultPkgEnvFn(pkgEnvs: any, customEnvName: string) {
    return (pkgName: string) => {
      const defEnvs = {
        '@moodlenet/http-server': { port: 8080 },
        '@moodlenet/arangodb': { connectionCfg: { url: 'http://localhost:8530' } },
        '@moodlenet/authentication-manager': { rootPassword: 'root' },
        '@moodlenet/email-service': {
          mailerCfg: { transport: { jsonTransport: true }, defaultFrom: 'noreply@moodlenet.local' },
        },
        ...pkgEnvs?.[customEnvName],
      }
      return defEnvs[pkgName]
    }
  }
})()
