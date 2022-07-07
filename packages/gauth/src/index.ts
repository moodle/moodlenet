import type { CoreExt, Ext, ExtDef } from '@moodlenet/core'
import type { MNHttpServerExt } from '@moodlenet/http-server'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'
import { creatApp } from './server'

export type ExtensionsManagerExt = ExtDef<'moodlenet-gauth', '0.1.10', {}>

const ext: Ext<ExtensionsManagerExt, [CoreExt, ReactAppExt]> = {
  id: 'moodlenet-gauth@0.1.10',
  displayName: 'gauth ext',
  requires: ['moodlenet-core@0.1.10', 'moodlenet.react-app@0.1.10'],
  enable(shell) {
    shell.onExtInstance<ReactAppExt>('moodlenet.react-app@0.1.10', inst => {
      console.log(`moodlenet-gauth: onExtInstance<ReactAppExt>`, inst)
      inst.setup({
        routes: {
          moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'extRoutes.tsx'),
          rootPath: 'gauth/',
        },
        // ctxProvider: {
        //   moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'ExtensionsProvider'),
        // },
      })
    })
    // by etto http://localhost:3000/_/moodlenet-gauth/auth/me/
    shell.onExtInstance<MNHttpServerExt>('moodlenet-http-server@0.1.10', inst => {
      const app = inst.express()
      creatApp(app)
      inst.mount({ mountApp: app })
    })
    shell.expose({})
    return {
      deploy() {
        shell.lib.pubAll<ExtensionsManagerExt>('moodlenet-gauth@0.1.10', shell, {})
        return {}
      },
    }
  },
}

export default { exts: [ext] }
