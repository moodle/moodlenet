import { UserId } from '@moodlenet/authentication-manager'
import { GlyphDefsMap, GlyphDescriptorsMap } from '@moodlenet/content-graph'

export type ProfileGlyphs = GlyphDefsMap<{
  Profile: { kind: 'node'; type: { title: string } }
}>

export type Lib = {
  glyphDescriptors: GlyphDescriptorsMap<ProfileGlyphs>
}

export type CreateRequest = {
  displayName: string
  userId: UserId
}
