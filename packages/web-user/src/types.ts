import { GlyphDefsMap, GlyphDescriptorsMap } from '@moodlenet/content-graph'

export type ProfileGlyphs = GlyphDefsMap<{
  Profile: { kind: 'node'; type: { title: string } }
}>

export type Lib = {
  glyphDescriptors: GlyphDescriptorsMap<ProfileGlyphs>
}
