import { createNode, editNode, extractNodeMeta, query, readNode } from '@moodlenet/content-graph'
import { glyphDescriptors } from './init.mjs'
import shell from './shell.mjs'
import { CreateRequest, EditRequest, WebUserGlyphDescriptors, WebUserGlyphs } from './types.mjs'

export async function createProfile({ title: title, userId }: CreateRequest) {
  shell.call(createNode)(
    glyphDescriptors.Profile,
    {
      description: '',
      title,
    },
    { authenticableBy: { userId } },
  )
}

export async function editProfile(_key: string, { title, description }: EditRequest) {
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
  return node
}

export async function getProfile(_key: string) {
  // TODO: this must rewrite better like utility for now we inject by hand Profile
  const res = await shell.call(readNode)<WebUserGlyphDescriptors['Profile']>({
    _key,
    ...glyphDescriptors.Profile,
  })
  if (!res) {
    return null
  }
  const { node } = extractNodeMeta(res)
  return node
}

export async function searchUsers(search: string) {
  const q = `
    FOR profile in \`${glyphDescriptors.Profile._type}\`
    let similarity = NGRAM_POSITIONAL_SIMILARITY(profile.title, @search, 2)
    SORT similarity DESC
    FILTER similarity > 0.05
    LIMIT 10
    RETURN profile`
  const profiles: WebUserGlyphs['Profile'][] = (
    await shell.call(query)({
      q,
      bindVars: { search },
    })
  ).resultSet

  return profiles.map(extractNodeMeta).map(({ node }) => node)
}
