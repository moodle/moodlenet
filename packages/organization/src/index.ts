import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import { KeyValueStoreExtDef } from '@moodlenet/key-value-store'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'

/* const stmpServer = sibTransport({
  apiKey: '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',
}) */

interface Organization {
  name: string
  title: string
  subtitle: string
}

const configLocal = {
  service: 'SendinBlue', // no need to set host or port etc.
  auth: {
    user: 'shukeenkel@gmail.com',
    pass: 'MTF0wXL7mrOVA4sQ',
  },
}

/*
const configLocal = {
   service: 'SendinBlue', // no need to set host or port etc.
   auth: {
       user: 'yourRegisteredEmailOnSendinblue@email.com',
       pass: 'xxxxx!'
   } 
}
*/

export type OrganizationData = ExtDef<
  '@moodlenet/organization',
  '0.1.0',
  void,
  {
    set: SubTopo<{ payload: Organization }, { valid: true } | { valid: false }>
    get: SubTopo<{}, { valid: true; data: Organization } | { valid: false }>
  }
>

const ext: Ext<OrganizationData, [CoreExt, ReactAppExt, KeyValueStoreExtDef]> = {
  name: '@moodlenet/organization',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/react-app@0.1.0', '@moodlenet/key-value-store@0.1.0'],
  async connect(shell) {
    const [, reactApp, kvStore] = shell.deps
    const kvtore = await kvStore.plug.getStore<{ organitation: Organization }>()
    return {
      deploy() {
        // come lo passo nel codice ?
        // business logic, wire-up to the message system,
        // other packages integration
        //   listen to messages -> send other messages
        //    use other packages plugins (e.g add UI to react app, or add http-endpoint)

        // come lo passo
        // const mailer )getNodemailerSendEmailAdapter({smtp:'smtp:moodlenet.com'})
        reactApp.plug.setup({
          routes: {
            moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'Router.tsx'),
            // rootPath: 'organization', // http://localhost:3000/my-test
          },
        })

        shell.expose({
          // http://localhost:8080/_/_/raw-sub/moodlenet-organization/0.1.10/_test  body:{"paramIn2": "33"}
          'get/sub': {
            validate(/* data */) {
              return { valid: true }
            },
          },
          'set/sub': {
            validate(/* data */) {
              return { valid: true }
            },
          },
        })

        shell.provide.services({
          async set({ payload }) {
            kvStore.set('organization', '', { privateKey, publicKey })
            return msg
          },
        })
        return {}
      },
    }
  },
}

export default ext
