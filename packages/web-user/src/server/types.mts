import { UserId } from '@moodlenet/authentication-manager'
import { GlyphDefsMap, GlyphDescriptorsMap } from '@moodlenet/content-graph'
import { ProfileFormValues } from '../common/types.mjs'
export * from '../common/types.mjs'

export type ProfileGlyphs = GlyphDefsMap<{
  Profile: {
    kind: 'node'
    type: { displayName: string; organizationName?: string; location?: string; siteUrl?: string }
  }
}>

export type ProfileGlyphDescriptors = GlyphDescriptorsMap<ProfileGlyphs>

export type CreateRequest = {
  description?: string
  displayName: string
  userId: UserId // dont confuse with GlyphID, this is from authentication-manager
}

export type EditRequest = ProfileFormValues
