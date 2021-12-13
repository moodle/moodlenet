import { GraphNodeIdentifierAuth } from '@moodlenet/common/dist/content-graph/types/node'
import { localOrg } from '../../ports/system'

export const isLocalOrganizationAuthId = async (_?: GraphNodeIdentifierAuth | null) => {
  if (_?._type !== 'Organization') {
    return false
  }
  const { authId } = await localOrg.info.adapter()
  return _._permId === authId._permId && _._authKey === authId._authKey && _._type === authId._type
}
