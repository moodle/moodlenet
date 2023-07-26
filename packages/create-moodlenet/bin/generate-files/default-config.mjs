import { writeFile } from 'fs/promises'
import { resolve } from 'path'
import { crypto, devInstallLocalRepoSymlinks, installDir, npmRegistry } from '../env.mjs'

const config = await defaultConfigJson(installDir)
const configJsonFilename = resolve(installDir, 'default.config.json')
await writeFile(configJsonFilename, JSON.stringify(config, null, 2))

async function defaultConfigJson() {
  const { defaultKeyFilenames, alg, type } = crypto
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
      '@moodlenet/ed-resource': {
        resourceUploadMaxSize: '1.2GB',
      },
      '@moodlenet/simple-email-auth': {
        newUserNotPublisher: false,
      },
      '@moodlenet/email-service': {
        nodemailerTransport: {
          jsonTransport: true,
        },
      },
      '@moodlenet/system-entities': {
        rootPassword: devInstallLocalRepoSymlinks ? 'root' : Math.random().toString(36).slice(2),
      },
      '@moodlenet/react-app': {
        defaultImageUploadMaxSize: '3MB',
        noWebappServer: devInstallLocalRepoSymlinks ? true : undefined,
      },
    },
  }
}
