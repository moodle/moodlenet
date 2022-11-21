import { glyphDescriptors } from './init.mjs'
import { CreateRequest, EditRequest, Profile, ProfileGlyphs } from './types.mjs'
import { graphPkg } from './use-pkg-apis.mjs'

export async function createProfile({ displayName, userId }: CreateRequest) {
  graphPkg.api('node/create')(
    glyphDescriptors.Profile,
    {
      description: '',
      title: displayName,
    },
    { authenticableBy: { userId } },
  )
}

export async function editProfile({ displayName, userId }: EditRequest) {
  graphPkg.api('node/edit')(
    glyphDescriptors.Profile,
    {
      description: '',
      title: displayName,
    },
    { authenticableBy: { userId } },
  )
}

export async function getProfile(userId: string): Promise<Profile | null> {
  // TODO: viene riscritto meglio con utility, per ora insrisco profile a mano
  const res = await graphPkg.api('node/read')({ identifier: { _key: userId, _type: 'Profile' } }) // ({ identifier: glyphDescriptors })
  if (!res) return null
  return {
    profileId: res.node._id,
    title: res.node.title,
    description: res.node.description as string,
  }
}
