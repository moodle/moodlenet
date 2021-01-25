import { getAuthUserId } from '../../../../../../MoodleNetGraphQL'
import { Types } from '../../../types'
import { findNode } from '../apis/findNode'
export const getSessionAccountUser: Types.Resolvers['Query']['getSessionAccountUser'] = async (
  _root,
  { username } /* , _ctx, _info */
) => {
  const _id = getAuthUserId({ accountUsername: username })
  return {
    user: await findNode({ _id }),
  } as any
}
