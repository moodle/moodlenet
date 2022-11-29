import { GraphNodeIdentifierAuth } from '@moodlenet/common/dist/content-graph/types/node'
import { ns } from '../../../lib/ns/namespace'
import { plug } from '../../../lib/plug'
import { adapter as publicUrlProtocolAdapter } from '../http/publicUrlProtocol'
import { adapter as localOrgAdapter } from '../localOrg/node'

export const adapter = plug(ns(module, 'adapter'), async () => {
  const localOrg = await localOrgAdapter()
  const publicUrlProtocol = await publicUrlProtocolAdapter()
  const publicUrl = `${publicUrlProtocol}://${localOrg.domain}`
  const authId: GraphNodeIdentifierAuth<'Organization'> = {
    //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    _authKey: localOrg._authKey!,
    _permId: localOrg._permId,
    _type: localOrg._type,
  }

  return { authId, localOrg, publicUrlProtocol, publicUrl }
})
