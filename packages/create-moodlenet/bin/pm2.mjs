import { writeFile } from 'fs/promises'
import { resolve } from 'path'
import {
  installDir,
  devInstallLocalRepoSymlinks,
  currentRegistry,
  installationName,
} from './env.mjs'

console.log(`
installing pm2 config...
`)

const pm2ConfigFileName = `${installationName}.config.js`
await writeFile(resolve(installDir, pm2ConfigFileName), getPm2ConfigFileStr(), {
  encoding: 'utf8',
})

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
    script: 'npm',
    args: 'start',
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
