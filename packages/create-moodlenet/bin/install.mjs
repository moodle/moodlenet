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
const installationBaseDir = basename(installDir)
const installationName = `moodlenet.${installationBaseDir}`
const pm2ConfigFileName = `${installationName}.config.js`

const { devInstallLocalRepoSymlinks } = argv

await mkdir(installDir, { recursive: true })

const currentRegistryStr = (await execa('npm', ['get', 'registry'])).stdout
const currentRegistry = currentRegistryStr === 'undefined' ? undefined : currentRegistryStr

const installPkgJson = await freshInstallPkgJson()
await writeFile(resolve(installDir, 'package.json'), JSON.stringify(installPkgJson, null, 2), {
  encoding: 'utf8',
})

console.log(`
installing pm2 config...
`)
await writeFile(resolve(installDir, pm2ConfigFileName), getPm2ConfigFileStr(), {
  encoding: 'utf8',
})

console.log(`
installing moodlenet@${myPkgJson.version} core packages in ${installDir}
may take some time...
`)
await execa('npm', ['install'], {
  cwd: installDir,
  stdout: process.stdout,
})

console.log(`
installing pm2...
`)

await writeFile(resolve(installDir, pm2ConfigFileName), getPm2ConfigFileStr(), {
  encoding: 'utf8',
})
!devInstallLocalRepoSymlinks &&
  (await execa('npm', ['install', '-D', 'pm2'], {
    cwd: installDir,
    stdout: process.stdout,
  }))

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
      const version = devInstallLocalRepoSymlinks
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
    name: installationName,
    version: '1',
    installTimeVersion: myPkgJson.version,
    scripts: {
      'start': `pm2 --env=production --source-map-support --force --name ${installationName} --update-env --attach --wait-ready restart ${pm2ConfigFileName}`,
      'start-dev': `pm2-dev --ignore=moodlenet-lock.json,package-lock.json --env=development --raw --node-args="--trace-uncaught --enable-source-maps" start ${pm2ConfigFileName}`,
    },
    dependencies,
  }
}
function getPm2ConfigFileStr() {
  const currentRegistryEnvVar = currentRegistry ? `'${currentRegistry}'` : 'undefined'
  const MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES_VAR = devInstallLocalRepoSymlinks
    ? `
    MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES: 'true',
`
    : ''
  return `
module.exports = {
  apps: [{
    name: '${installationName}',
    script: 'npx',
    args: '@moodlenet/core',
    cwd: '.',    
    env_development: {${MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES_VAR}
      npm_config_registry: ${currentRegistryEnvVar},
      NODE_ENV: 'development',
    },
    env_production: {${MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES_VAR}
      npm_config_registry: ${currentRegistryEnvVar},
      NODE_ENV: 'production',
    }
  }]
}
`
}

// async function writeJson(path, json) {
//   await writeFile(path, JSON.stringify(json, null, 2), {
//     encoding: 'utf8',
//   })
// }
