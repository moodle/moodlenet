import { Profile } from '@moodlenet/common/lib/content-graph/types/node'
import { AuthId } from '@moodlenet/common/lib/user-auth/types'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { QMModule, QMQuery } from '../../lib/qmino'

export type ByAuthIdAdapter = {
  getProfileByAuthId: (_: ByAuthIdInput) => Promise<Maybe<Profile>>
}

export type ByAuthIdInput = { authId: AuthId }

export const getByAuthId = QMQuery(({ authId }: ByAuthIdInput) => async ({ getProfileByAuthId }: ByAuthIdAdapter) => {
  return getProfileByAuthId({ authId })
})

QMModule(module)
