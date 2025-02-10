import { signed_token } from '@moodle/lib-types'
import { Option } from 'fp-ts/Option'

/* eslint-disable @typescript-eslint/no-invalid-void-type */
export type accessControl = moo.model<AccessControlModel>

export type AccessControlModel = {
  sessionConfigs: moo.model.type.entityData<moo.session.configs>
  getSession: moo.model.type.endpoint<
    ['query', Option<{ userId: string }>, { session: moo.session.user; token: signed_token }]
  >
}
