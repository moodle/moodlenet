#!/usr/bin/env node
// import boot from '../main/boot'
import prompts from 'prompts'
import install from '../main/install'
import { MainFolders } from '../types'

export default cli_install

async function cli_install({ mainFolders }: { mainFolders: MainFolders }) {
  const {
    'http-port': httpPort,
    'arango-url': arangoUrl,
    'root-password': rootPassword,
    'smtp-url': smtpUrl,
  } = await prompts([
    {
      type: 'number',
      initial: 8080,
      name: 'http-port',
      message: `http port?`,
    },
    {
      type: 'text',
      initial: 'http://localhost:8530',
      name: 'arango-url',
      message: `arangodb url ?`,
    },
    {
      type: 'password',
      name: 'root-password',
      message: `root password ?`,
    },
    {
      type: 'text',
      name: 'smtp-url',
      message: `smtp url ?`,
    },
  ])

  return install({ mainFolders, defaultPkgEnv })

  function defaultPkgEnv(pkgName: string) {
    const defConfigs = {
      '@moodlenet/http-server': { port: httpPort },
      '@moodlenet/arangodb': { connectionCfg: { url: arangoUrl } },
      '@moodlenet/authentication-manager': { rootPassword },
      '@moodlenet/email-service': {
        mailerCfg: { transport: smtpUrl },
      },
    } as any
    return defConfigs[pkgName]
  }
}
