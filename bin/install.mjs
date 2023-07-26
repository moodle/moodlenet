#!/usr/bin/env node

import execa from 'execa'
import { open, writeFile } from 'fs/promises'
import * as jose from 'jose'
import { resolve } from 'path'
import rimraf from 'rimraf'
import { devMachinesDir, fwRestArgs, mnDevDir, restOpts } from './env.mjs'

if (restOpts.clean) {
  rimraf.sync(mnDevDir)
}

await mnCreateInstall()
await generateInstanceConfigFile()

async function mnCreateInstall() {
  console.log(`installing dev in ${mnDevDir}`, { fwRestArgs, restOpts })
  await execa(
    'npm',
    ['start', '--', mnDevDir, '--dev-install-local-repo-symlinks', ...fwRestArgs],
    {
      cwd: resolve(process.cwd(), 'packages', 'create-moodlenet'),
      timeout: 600000,
      stdout: process.stdout,
    },
  )
}

async function generateInstanceConfigFile() {
  const configJsonFilename = resolve(mnDevDir, 'default.config.json')

  const defaultConfigJsonTemplate = await defaultConfigJson()
  await writeFile(configJsonFilename, JSON.stringify(defaultConfigJsonTemplate, null, 2))
}

async function ensureDefaultKeypairs() {
  const defaultKeyFilenames = {
    private: resolve(devMachinesDir, 'default.crypto.privateKey'),
    public: resolve(devMachinesDir, 'default.crypto.publicKey'),
  }

  const alg = 'RS256'
  const type = 'PKCS8'
  try {
    await Promise.all([
      open(defaultKeyFilenames.private, 'r').then(_ => _.close()),
      open(defaultKeyFilenames.public, 'r').then(_ => _.close()),
    ])
  } catch {
    const keysLike = await jose.generateKeyPair(alg, { modulusLength: 2048 /* minimum */ })

    //const privateKey = await jose.importPKCS8(keystr.privateKey, alg)
    // console.log(inspect({ keysLike1 }))
    const keystr = {
      privateKey: await jose.exportPKCS8(keysLike.privateKey),
      publicKey: await jose.exportSPKI(keysLike.publicKey),
    }
    await writeFile(defaultKeyFilenames.private, keystr.privateKey, 'utf-8')
    await writeFile(defaultKeyFilenames.public, keystr.publicKey, 'utf-8')
  }
  return { defaultKeyFilenames, alg, type }
}

async function defaultConfigJson() {
  const { defaultKeyFilenames, alg, type } = await ensureDefaultKeypairs()
  const npmRegistry = await getNpmRegistry()

  return {
    pkgs: {
      '@moodlenet/core': {
        baseFsFolder: resolve(mnDevDir, 'fs'),
        instanceDomain: 'http://localhost:8080',
        npmRegistry,
        mainLogger: {
          consoleLevel: 'debug',
          file: {
            path: './log/moodlenet.%DATE%.log',
            level: 'debug',
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
        defaultRpcUploadMaxSize: '5MB',
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
        rootPassword: 'root',
      },
      '@moodlenet/react-app': {
        noWebappServer: true,
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
