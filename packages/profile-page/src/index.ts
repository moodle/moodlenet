import type { CoreExt, Ext, ExtDef } from '@moodlenet/core'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'

export type TestExt = ExtDef<'@moodlenet/profile-page', '0.1.0', void>

const ext: Ext<TestExt, [CoreExt, ReactAppExt]> = {
  name: '@moodlenet/profile-page',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/react-app@0.1.0'],
  async connect(shell) {
    const [, reactApp] = shell.deps
    reactApp.plug.setup({
      ctxProvider: {
        moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'MainProvider.tsx'),
      },
      routes: {
        moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'Router.tsx'),
        rootPath: 'profile', // http://localhost:3000/profile
      },
    })
    return {
      deploy() {
        return {}
      },
    }
  },
}

export default ext
