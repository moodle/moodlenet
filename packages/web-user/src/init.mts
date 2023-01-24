import { expose as auth } from '@moodlenet/authentication-manager'
import { ensureGlyphs } from '@moodlenet/content-graph'
import { plugin } from '@moodlenet/react-app/server'
import { expose as me } from './expose.mjs'
import shell from './shell.mjs'
import { MyPkgDeps, ProfileGlyphs } from './types.mjs'

await shell.call(plugin)<MyPkgDeps>({
  mainComponentLoc: ['dist', 'webapp', 'MainComponent.js'],
  deps: { me, auth },
})
export const glyphDescriptors = await shell.call(ensureGlyphs)<ProfileGlyphs>({
  defs: { Profile: { kind: 'node' } },
})
