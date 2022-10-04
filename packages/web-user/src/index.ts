import { ContentGraphExtDef } from '@moodlenet/content-graph'
import type { CoreExt, Ext, ExtDef } from '@moodlenet/core'
import type { ReactAppExtDef } from '@moodlenet/react-app'
import { resolve } from 'path'
import { Lib, ProfileGlyphs } from './types'

export type WebUserExtDef = ExtDef<'@moodlenet/web-user', '0.1.0', Lib>

export type WebUserExt = Ext<WebUserExtDef, [CoreExt, ReactAppExtDef, ContentGraphExtDef]>
const ext: WebUserExt = {
  name: '@moodlenet/web-user',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/react-app@0.1.0', '@moodlenet/content-graph@0.1.0'],
  async connect(shell) {
    const [, reactApp, contentGraph] = shell.deps

    reactApp.plug.setup({
      mainModuleLoc: resolve(__dirname, '..', 'src', 'webapp', 'MainModule.tsx'),
      // routes: {
      //   moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'Router.tsx'),
      //   rootPath: 'profile', // http://localhost:3000/profile
      // },
    })

    const glyphDescriptors = await contentGraph.plug.ensureGlyphs<ProfileGlyphs>({
      defs: { Profile: { kind: 'node' } },
    })
    return {
      deploy() {
        return {
          plug(
            {
              /* shell */
            },
          ) {
            return {
              glyphDescriptors,
            }
          },
        }
      },
    }
  },
}

export default ext
