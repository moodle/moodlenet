import yargs from 'yargs'
import { dirname, resolve, basename } from 'path'
import { mkdir, readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import execa from 'execa'

export const myModuleDir = dirname(fileURLToPath(import.meta.url))
export const myPkgJson = JSON.parse(await readFile(resolve(myModuleDir, '..', 'package.json')))
const opts = await yargs(process.argv.slice(2))
const argv = await opts.argv

export const installDir = resolve(process.cwd(), String(argv._))
await mkdir(installDir, { recursive: true })

export const installationBaseDir = basename(installDir)
export const installationName = `moodlenet.${installationBaseDir}`
export const { devInstallLocalRepoSymlinks } = argv

const currentRegistryStr = (await execa('npm', ['get', 'registry'])).stdout
export const currentRegistry =
  currentRegistryStr === 'undefined' ? 'https://registry.npmjs.org/' : currentRegistryStr

export const defaultCorePackages = [
  'core',
  'arangodb',
  'key-value-store',
  'crypto',
  'authentication-manager',
  'http-server',
  'organization',
  'content-graph',
  'email-service',
  'react-app',
  'extensions-manager',
  'simple-email-auth',
  // 'web-user',
  // 'passport-auth',
  // 'test-extension',
  // 'test-extension-2',
]
