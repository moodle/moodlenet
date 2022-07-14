import type { CoreExt, Ext, ExtDef } from '@moodlenet/core'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'

export type ExtensionsManagerExt = ExtDef<'moodlenet-extensions-manager', '0.1.10', {}>

const ext: Ext<ExtensionsManagerExt, [CoreExt, ReactAppExt]> = {
  id: 'moodlenet-extensions-manager@0.1.10',
  displayName: 'extensions mng ext',
  requires: ['moodlenet-core@0.1.10', 'moodlenet.react-app@0.1.10'],
  enable(shell) {
    shell.onExtInstance<ReactAppExt>('moodlenet.react-app@0.1.10', inst => {
      console.log(`moodlenet-extensions-manager: onExtInstance<ReactAppExt>`, inst)
      inst.setup({
        routes: {
          moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'ExtensionsRoutes.tsx'),
          rootPath: 'extensions/',
        },
        ctxProvider: {
          moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'ExtensionsProvider.tsx'),
        },
      })
    })
    shell.expose({})
    return {
      deploy() {
        shell.lib.pubAll<ExtensionsManagerExt>('moodlenet-extensions-manager@0.1.10', shell, {})
        return {}
      },
    }
  },
}

export default { exts: [ext] }
