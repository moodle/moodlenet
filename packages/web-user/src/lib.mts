import { NodeGlyph } from '@moodlenet/content-graph'
import { CreateRequest, EditRequest, ProfileGlyphDescriptors, ProfileGlyphs } from './types.mjs'
import { graphPkg } from './use-pkg-apis.mjs'

export const glyphDescriptors = await graphPkg.api('ensureGlyphs')<ProfileGlyphs>({
  defs: { Profile: { kind: 'node' } },
})

export async function createProfile({ displayName, userId }: CreateRequest) {
  graphPkg.api('node/create')(
    glyphDescriptors.Profile,
    {
      description: '',
      title: displayName,
      displayName,
    },
    { authenticableBy: { userId } },
  )
}

export async function editProfile(_key: string, { displayName, description }: EditRequest) {
  const res = await graphPkg.api('node/edit')(
    glyphDescriptors.Profile,
    {
      _key,
      ...glyphDescriptors.Profile,
    },
    {
      description,
      displayName,
      title: displayName,
    },
  )
  if (!res) {
    return null
  }
  return res.node
}

export async function getProfile(
  _key: string,
): Promise<NodeGlyph<ProfileGlyphDescriptors['Profile']> | null> {
  // TODO: viene riscritto meglio con utility, per ora insrisco profile a mano
  const res = await graphPkg.api('node/read')<ProfileGlyphDescriptors['Profile']>({
    _key,
    ...glyphDescriptors.Profile,
  })
  if (!res) {
    return null
  }
  return res.node
}
