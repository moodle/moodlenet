import type { CoreExt, Ext, ExtDef } from '@moodlenet/core'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'

export type AuthenticationManagerExt = ExtDef<'moodlenet-authentication-manager', '0.1.10', {}>

const ext: Ext<AuthenticationManagerExt, [CoreExt, ReactAppExt]> = {
  id: 'moodlenet-authentication-manager@0.1.10',
  displayName: 'auth mng ext',
  requires: ['moodlenet-core@0.1.10', 'moodlenet.react-app@0.1.10'],
  enable(shell) {
    shell.onExtInstance<ReactAppExt>('moodlenet.react-app@0.1.10', inst => {
      console.log(`moodlenet-authentication-manager: onExtInstance<ReactAppExt>`, inst)
      inst.setup({
        routes: {
          moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'AuthRoutes.tsx'),
          rootPath: 'login/',
        },
        ctxProvider: {
          moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'AuthProvider.tsx'),
        },
      })
    })
    shell.expose({})
    return {
      deploy() {
        shell.lib.pubAll<AuthenticationManagerExt>('moodlenet-authentication-manager@0.1.10', shell, {})
        return {}
      },
    }
  },
}

export default { exts: [ext] }
