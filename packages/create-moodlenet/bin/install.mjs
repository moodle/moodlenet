#!/usr/bin/env node

import yargs from 'yargs'
import execa from 'execa'
import { dirname, resolve, basename } from 'path'
import { mkdir, writeFile, readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
const myModuleDir = dirname(fileURLToPath(import.meta.url))
const myPkgJson = JSON.parse(await readFile(resolve(myModuleDir, '..', 'package.json')))

const opts = await yargs(process.argv.slice(2))
const argv = await opts.argv

const installDir = resolve(process.cwd(), String(argv._))

const { 'dev-install-local-repo-symlinks': useLocalRepo } = argv

await mkdir(installDir, { recursive: true })

const installPkgJson = await freshInstallPkgJson()

await writeFile(resolve(installDir, 'package.json'), JSON.stringify(installPkgJson, null, 2), {
  encoding: 'utf8',
})

console.log(`
installing moodlenet@${myPkgJson.version} in ${installDir}
may take some time...
`)

await execa('npm', ['install'], { cwd: installDir })

process.exit(0)

async function freshInstallPkgJson() {
  const defaultCorePackages = [
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

  const defaultCorePackageWithVersion = await Promise.all(
    defaultCorePackages.map(async pkgName => {
      const fullPkgName = `@moodlenet/${pkgName}`
      const version = useLocalRepo
        ? `file:${resolve(myModuleDir, '..', '..', pkgName)}`
        : (await execa('npm', ['view', fullPkgName, 'dist-tags.latest'])).stdout
      return {
        fullPkgName,
        version,
      }
    }),
  )

  const dependencies = defaultCorePackageWithVersion.reduce((_, { fullPkgName, version }) => {
    return {
      ..._,
      [fullPkgName]: version,
    }
  }, {})

  return {
    name: basename(installDir),
    version: '1',
    installTimeVersion: myPkgJson.version,
    scripts: {
      start: 'npx @moodlenet/core',
    },
    dependencies,
  }
}

// async function writeJson(path, json) {
//   await writeFile(path, JSON.stringify(json, null, 2), {
//     encoding: 'utf8',
//   })
// }
