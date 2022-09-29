import graphConn from '@moodlenet/content-graph'
import { ProfileGlyphs } from './types.mjs'
import { graphConnPkgApis, reactAppPkgApis } from './use-pkg-apis.mjs'
import { MyUsesPkgs } from './webapp/types.mjs'
export const WebAppUsesPkgs: MyUsesPkgs = [graphConn]

await reactAppPkgApis('plugin')({
  mainComponentLoc: ['lib', 'webapp', 'MainComponent.js'],
  usesPkgs: WebAppUsesPkgs,
})

export const glyphDescriptors = await graphConnPkgApis('ensureGlyphs')<ProfileGlyphs>({
  defs: { Profile: { kind: 'node' } },
})
