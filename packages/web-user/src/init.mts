import graphConn from '@moodlenet/content-graph'
import { ProfileGlyphs } from './types.mjs'
import { graphPkgApis, reactAppPkgApis } from './use-pkg-apis.mjs'
import { WebPkgDeps } from './webapp/types.mjs'
export const WebAppUsesPkgs: WebPkgDeps = [graphConn]

await reactAppPkgApis('plugin')<WebPkgDeps>({
  mainComponentLoc: ['lib', 'webapp', 'MainComponent.js'],
  usesPkgs: WebAppUsesPkgs,
})

export const glyphDescriptors = await graphPkgApis('ensureGlyphs')<ProfileGlyphs>({
  defs: { Profile: { kind: 'node' } },
})
