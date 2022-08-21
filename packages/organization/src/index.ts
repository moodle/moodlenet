import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import { KeyValueStoreExtDef } from '@moodlenet/key-value-store'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'

/* const stmpServer = sibTransport({
  apiKey: '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',
}) */

type OrgAnag={
  name: string;
  title: string;
  subtitle: string;
}

type Organization = {
  organization: OrgAnag
}

export type OrganizationData = ExtDef<
  '@moodlenet/organization',
  '0.1.0',
  void,
  {
    set: SubTopo<{ payload: any }, { valid: true } | { valid: false }>
    get: SubTopo<{}, { valid: true; data: Organization } | { valid: false }>
  }
>

const data ={nome:'ss', title:'aaa', subtitle:'subtitle'}

const ext: Ext<OrganizationData, [CoreExt, ReactAppExt, KeyValueStoreExtDef]> = {
  name: '@moodlenet/organization',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/react-app@0.1.0', '@moodlenet/key-value-store@0.1.0'],
  async connect(shell) {
    const [, reactApp, kvStorePkg] = shell.deps
    const kvStore = await kvStorePkg.plug.getStore<Organization>()
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
            return kvStore.set('organization', '', payload)
        
          },
          get: function (req: {}, msg: DataMessage<SubReqData<{}>, PortBinding, `${string}@${string}`, `${string}@${string}::${string}`>): ProvidedValOf<{ sub: Port<'in', SubReqData<{}>>; unsub: Port<'in', void>; value: Port<'out', ValueData<{ valid: true; data: Organization } | { valid: false }>> }> {
            throw new Error('Function not implemented.')
          }
        })
        return {}
      },
    }
  },
}

export default ext
