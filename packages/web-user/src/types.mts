import { UserId } from '@moodlenet/authentication-manager'
import { GlyphDefsMap, GlyphDescriptorsMap, GlyphID } from '@moodlenet/content-graph'

export type ProfileGlyphs = GlyphDefsMap<{
  Profile: {
    kind: 'node'
    type: {
      profileId: GlyphID
      title: string
      description: string
    }
  }
}>

export type Lib = {
  glyphDescriptors: GlyphDescriptorsMap<ProfileGlyphs>
}

export type CreateRequest = {
  displayName: string
  description: string
  title: string
  userId: UserId // dont confuse with GlyphID, this is from authentication-manager
}

export type EditRequest = {
  description: string
  title: string
  profileId: GlyphID // dont confuse with UserId this is from content-graph
}

export type GetRequest = {
  profileId: GlyphID
  displayName: string
  description: string
}

export type Profile = ProfileGlyphs['Profile']['type']
