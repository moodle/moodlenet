import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import { KeyValueStoreExtDef } from '@moodlenet/key-value-store'
import assert from 'assert'

/* const stmpServer = sibTransport({
  apiKey: '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',
}) */

export type OrganizationData = {
  instanceName: string
  landingTitle: string
  landingSubtitle: string
}

export type keyValueStoreData = { organizationData: OrganizationData }

export type OrganizationExtDef = ExtDef<
  '@moodlenet/organization',
  '0.1.0',
  void,
  {
    set: SubTopo<{ payload: OrganizationData }, { valid: true } | { valid: false }>
    get: SubTopo<void, { data: OrganizationData }>
  }
>

// const data ={nome:'ss', title:'aaa', subtitle:'subtitle'}

const ext: Ext<OrganizationExtDef, [CoreExt, KeyValueStoreExtDef]> = {
  name: '@moodlenet/organization',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/key-value-store@0.1.0'],

  async connect(shell) {
    const [, kvStorePkg] = shell.deps
    const kvStore = await kvStorePkg.plug.getStore<keyValueStoreData>()
    return {
      async install() {
        await kvStore.set('organizationData', '', {
          instanceName: 'MoodleNet',
          landingSubtitle: 'Find, share and curate open educational resources',
          landingTitle: 'Search for resources, subjects, collections or people',
        })
      },
      deploy() {
        // come lo passo nel codice ?
        // business logic, wire-up to the message system,
        // other packages integration
        //   listen to messages -> send other messages
        //    use other packages plugins (e.g add UI to react app, or add http-endpoint)

        // come lo passo
        // const mailer )getNodemailerSendEmailAdapter({smtp:'smtp:moodlenet.com'})

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
          async set(req) {
            const data = await kvStore.set('organizationData', '', req.payload)
            return { valid: !data || !data.value ? false : true }
          },
          async get() {
            const data = await kvStore.get('organizationData', '')
            assert(data.value, 'Organization should be valued')
            return { data: data.value }
          },
        })
        return {}
      },
    }
  },
}

export default ext
