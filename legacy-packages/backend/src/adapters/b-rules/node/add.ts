import { GraphNodeType } from '@moodlenet/common/dist/content-graph/types/node'
import { SockOf } from '../../../lib/plug'
import { Assertions, baseOperators } from '../../../ports/content-graph/graph-lang/base'
import { bRules } from '../../../ports/content-graph/node/add'
import { isLocalOrganizationAuthId } from '../helpers'

type Rules = 'nonEmptyName'
export const webUserAllowedAddTypes: GraphNodeType[] = ['Collection', 'Resource']
export const addNodeBRules: SockOf<typeof bRules> = async ({ arg, sessionEnv }) => {
  if (!sessionEnv.authId) {
    return null
  }
  const { bv } = await baseOperators()
  const assertions: Assertions<Rules> = {
    nonEmptyName: bv(!!arg.node.name),
  }

  if (await isLocalOrganizationAuthId(sessionEnv.authId)) {
    return { ...arg, assertions }
  }

  if (sessionEnv.authId?._type !== 'Profile') {
    if (!webUserAllowedAddTypes.includes(arg.node._type)) {
      return null
    }
  }

  return { ...arg, assertions }
}
