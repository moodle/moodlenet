import { GraphNodeType } from '@moodlenet/common/dist/content-graph/types/node'
import { SockOf } from '../../../lib/plug'
import { bRules } from '../../../ports/content-graph/node/add'
import { isLocalOrganizationAuthId } from '../helpers'

export const webUserAllowedAddTypes: GraphNodeType[] = ['Collection', 'Resource']
export const addNodeBRules: SockOf<typeof bRules> = async ({ arg, sessionEnv, data }) => {
  if (!sessionEnv.authId) {
    return null
  }
  if (await isLocalOrganizationAuthId(sessionEnv.authId)) {
    return { ...arg, assertions: {} }
  }

  if (sessionEnv.authId?._type !== 'Profile') {
    if (!webUserAllowedAddTypes.includes(data._type)) {
      return null
    }
  }

  return { ...arg, assertions: {} }
}
