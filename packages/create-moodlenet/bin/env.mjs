import { mkdir, readFile } from 'fs/promises'
import { basename, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import yargs from 'yargs'

export const myPkgDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const myPkgJson = JSON.parse(await readFile(resolve(myPkgDir, 'package.json')))
const opts = await yargs(process.argv.slice(2))
const argv = await opts.argv

export const installDir = resolve(process.cwd(), ...argv._.slice(0, 1).map(String))
await mkdir(installDir, { recursive: true })

export const installationName = `moodlenet.${basename(installDir)}`
export const { devInstallLocalRepoSymlinks } = argv

// const currentRegistryStr = (await execa('npm', ['get', 'registry'])).stdout
// exporat const currentRegistry =
//   currentRegistryStr === 'undefined' ? 'https://registry.npmjs.org/' : currentRegistryStr

export const defaultCorePackages = [
  'core',
  'arangodb',
  'crypto',
  'http-server',
  'organization',
  'system-entities',
  'email-service',
  'react-app',
  'extensions-manager',
  'simple-email-auth',
  'openid',
  'ed-resource',
  'collection',
  'web-user',
  'ed-meta',
]

export const crypto = {
  defaultKeyFilenames: {
    private: resolve(installDir, 'default.crypto.privateKey'),
    public: resolve(installDir, 'default.crypto.publicKey'),
  },
  alg: 'RS256',
  type: 'PKCS8',
}
export const configJsonFilename = resolve(installDir, 'default.config.json')

console.log(`
installing Moodlenet${myPkgJson.version} in directory:\`${installDir}\`
`)
