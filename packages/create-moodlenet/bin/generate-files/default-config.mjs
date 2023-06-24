import { execa } from 'execa'
import { writeFile } from 'fs/promises'
import { resolve } from 'path'
import { crypto, devInstallLocalRepoSymlinks, installDir } from '../env.mjs'

const config = await defaultConfigJson(installDir)
const configJsonFilename = resolve(installDir, 'default.config.json')
await writeFile(configJsonFilename, JSON.stringify(config, null, 2))

async function defaultConfigJson() {
  const { defaultKeyFilenames, alg, type } = crypto
  const npmRegistry = await getNpmRegistry()

  return {
    pkgs: {
      '@moodlenet/core': {
        baseFsFolder: resolve(installDir, 'fs'),
        instanceDomain: 'http://localhost:8080',
        npmRegistry,
        mainLogger: {
          consoleLevel: 'info',
          file: {
            path: './log/moodlenet.%DATE%.log',
            level: 'info',
          },
        },
      },
      '@moodlenet/crypto': {
        keys: {
          alg,
          type,
          private: defaultKeyFilenames.private,
          public: defaultKeyFilenames.public,
        },
      },
      '@moodlenet/arangodb': {
        connectionCfg: {
          url: 'http://localhost:8529',
        },
      },
      '@moodlenet/http-server': {
        port: 8080,
      },
      '@moodlenet/email-service': {
        nodemailerTransport: {
          jsonTransport: true,
        },
      },
      '@moodlenet/system-entities': {
        rootPassword: 'root',
      },
      '@moodlenet/react-app': {
        noWebappServer: devInstallLocalRepoSymlinks ? true : undefined,
      },
    },
  }
}

async function getNpmRegistry() {
  return (
    process.env.npm_config_registry ??
    process.env.NPM_CONFIG_REGISTRY ??
    (() => {
      const randomCasedEnvVarName = Object.keys(process.env).find(
        _ => _.toLowerCase() === 'npm_config_registry',
      )
      return randomCasedEnvVarName ? process.env[randomCasedEnvVarName] : undefined
    })() ??
    ((await execa('npm', ['get', 'registry'], { timeout: 10e3 })).stdout ||
      'https://registry.npmjs.org/')
  ).replace(/\/$/, '')
}
