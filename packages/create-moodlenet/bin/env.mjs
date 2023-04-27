import { mkdir, readFile } from 'fs/promises'
import { basename, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import yargs from 'yargs'

export const myModuleDir = dirname(fileURLToPath(import.meta.url))
export const myPkgJson = JSON.parse(await readFile(resolve(myModuleDir, '..', 'package.json')))
const opts = await yargs(process.argv.slice(2))
const argv = await opts.argv

export const installDir = resolve(process.cwd(), String(argv._))
await mkdir(installDir, { recursive: true })

export const installationBaseDir = basename(installDir)
export const installationName = `moodlenet.${installationBaseDir}`
export const { devInstallLocalRepoSymlinks } = argv

// const currentRegistryStr = (await execa('npm', ['get', 'registry'])).stdout
// export const currentRegistry =
//   currentRegistryStr === 'undefined' ? 'https://registry.npmjs.org/' : currentRegistryStr

export const defaultCorePackages = [
  'core',
  'arangodb',
  'key-value-store',
  'crypto',
  'http-server',
  'organization',
  'system-entities',
  'email-service',
  'react-app',
  'extensions-manager',
  'simple-email-auth',
  'simple-file-store',
  'openid',
  'ed-resource',
  'collection',
  'web-user',
  'ed-meta',
]
