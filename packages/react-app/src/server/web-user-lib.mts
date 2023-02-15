import { queryRs } from '@moodlenet/arangodb'
import { createNode, editNode, extractNodeMeta, readNode } from '@moodlenet/content-graph'
import { glyphDescriptors } from './init.mjs'
import shell from './shell.mjs'
import { Contacts, CreateRequest, ProfileFormValues, WebUserGlyphDescriptors } from './types.mjs'

type User = {
  isAdmin: boolean
  profileKey: string
  name: string
  contacts: Contacts
}

export async function createProfile({ title: title, userId, isAdmin, contacts }: CreateRequest) {
  const profile = await shell.call(createNode)(glyphDescriptors.Profile, {
    description: '',
    title,
  })
  const user: User = {
    isAdmin,
    profileKey: profile._key,
    name: profile.title,
    contacts,
  }
  await shell.call(queryRs)({
    q: `
      INSERT @user INTO User
    `,

    bindVars: { user: { ...user, _key: userId } },
  })
}

export async function editProfile(_key: string, { title, description }: ProfileFormValues) {
  const res = await shell.call(editNode)(
    glyphDescriptors.Profile,
    {
      _key,
      ...glyphDescriptors.Profile,
    },
    {
      description,
      title,
    },
  )
  if (!res) {
    return null
  }
  const { node } = extractNodeMeta(res)
  await patchProfileUser({ profile: _key }, { name: title })
  return node
}

export async function getProfileUser(_key: string): Promise<User | undefined> {
  const user = (
    await shell.call(queryRs)({
      q: `
        RETURN DOCUMENT(@id)
      `,
      bindVars: { id: `User/${_key}` },
    })
  ).resultSet[0]

  return user
}
export async function patchProfileUser(
  byKey: { profile: string } | { user: string },
  patch: Partial<User> | string,
) {
  const byUserKey = 'user' in byKey
  const key = byUserKey ? byKey.user : byKey.profile

  await shell.call(queryRs)({
    q: `
      FOR user in User 
        FILTER user.${byUserKey ? '_key' : 'profileKey'} == @key
        UPDATE user
        WITH ${typeof patch === 'string' ? patch : '@patch'} 
        INTO User
    `,
    bindVars: { patch, key },
  })
}

export async function getProfile(_key: string) {
  // TODO: this must rewrite better like utility for now we inject by hand Profile
  const node = await shell.call(readNode)<WebUserGlyphDescriptors['Profile']>({
    _key,
    ...glyphDescriptors.Profile,
  })
  if (!node) {
    return null
  }
  return node
}

export async function searchUsers(search: string) {
  const q = `
    FOR profileUser in User
    let matchScore = LENGTH(@search) < 1 ? 1 
                      : NGRAM_POSITIONAL_SIMILARITY(profileUser.name, @search, 2)
                        + NGRAM_POSITIONAL_SIMILARITY(profileUser.contacts.email, @search, 2)
    SORT matchScore DESC
    FILTER matchScore > 0.05
    LIMIT 10
    RETURN profileUser`
  const userProfiles: (User & { _key: string })[] = (
    await shell.call(queryRs)({
      q,
      bindVars: { search },
    })
  ).resultSet

  return userProfiles //.map(extractNodeMeta).map(({ node }) => node)
}
