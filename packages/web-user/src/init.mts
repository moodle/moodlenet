import graphConn from '@moodlenet/content-graph'
import { ProfileGlyphs } from './types.mjs'
import { graphPkg, reactAppPkg } from './use-pkg-apis.mjs'
import { WebPkgDeps } from './webapp/types.mjs'
export const WebAppUsesPkgs: WebPkgDeps = [graphConn]

await reactAppPkg.api('plugin')<WebPkgDeps>({
  mainComponentLoc: ['lib', 'webapp', 'MainComponent.js'],
  usesPkgs: WebAppUsesPkgs,
})

export const glyphDescriptors = await graphPkg.api('ensureGlyphs')<ProfileGlyphs>({
  defs: { Profile: { kind: 'node' } },
})
