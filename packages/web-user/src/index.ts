import { ContentGraphExtDef } from '@moodlenet/content-graph'
import type { CoreExt, Ext, ExtDef } from '@moodlenet/core'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'
import { Lib, ProfileGlyphs } from './types'

export type ProfileExtDef = ExtDef<'@moodlenet/web-user', '0.1.0', Lib>

const ext: Ext<ProfileExtDef, [CoreExt, ReactAppExt, ContentGraphExtDef]> = {
  name: '@moodlenet/web-user',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/react-app@0.1.0', '@moodlenet/content-graph@0.1.0'],
  async connect(shell) {
    const [, reactApp, contentGraph] = shell.deps

    reactApp.plug.setup({
      ctxProvider: {
        moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'MainProvider.tsx'),
      },
      routes: {
        moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'Router.tsx'),
        rootPath: 'profile', // http://localhost:3000/profile
      },
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
