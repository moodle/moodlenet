import { createNode, editNode, NodeGlyph, readNode } from '@moodlenet/content-graph'
import { glyphDescriptors } from './init.mjs'
import shell from './shell.mjs'
import { CreateRequest, EditRequest, ProfileGlyphDescriptors } from './types.mjs'

export async function createProfile({ displayName, userId }: CreateRequest) {
  shell.call(createNode)(
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
  const res = await shell.call(editNode)(
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
  // TODO: this must rewrite better like utility for now we inject by hand Profile
  const res = await shell.call(readNode)<ProfileGlyphDescriptors['Profile']>({
    _key,
    ...glyphDescriptors.Profile,
  })
  if (!res) {
    return null
  }
  return res.node
}
