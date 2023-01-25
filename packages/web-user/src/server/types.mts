import { UserId } from '@moodlenet/authentication-manager'
import { GlyphDefsMap, GlyphDescriptorsMap, GlyphsMapOf } from '@moodlenet/content-graph'
import { ProfileFormValues } from '../common/types.mjs'
export * from '../common/types.mjs'

export type WebUserGlyphDefMap = GlyphDefsMap<{
  Profile: {
    kind: 'node'
    type: { organizationName?: string; location?: string; siteUrl?: string }
  }
}>

export type WebUserGlyphDescriptors = GlyphDescriptorsMap<WebUserGlyphDefMap>
export type WebUserGlyphs = GlyphsMapOf<WebUserGlyphDescriptors>

export type CreateRequest = {
  description?: string
  title: string
  userId: UserId // dont confuse with GlyphID, this is from authentication-manager
}

export type EditRequest = ProfileFormValues
