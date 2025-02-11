/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { signed_token_schema } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { object } from 'zod'
import { error4xx } from '../../../../../../moo/lib/access-error'
import { userDataConfigs } from '../../../../../model/userAccount.model/userAccount.model'
import { generalUserDataConfigsFlow } from '../../../../any.persona/any.gates.helper'
import { userDataZodSchemas } from '../../../../any.persona/any.persona'

export type setNew = moo.persona.endpoint<[typeof setNewSchema, void, void]>

export const setNew_Gate: moo.gate.endpointProvider<setNew> = flow(
  generalUserDataConfigsFlow,
  O.bind('zod', flow(O.some, O.map(setNewSchema))),
  E.fromOption(() => error4xx('Unauthorized')),
)

export function setNewSchema({ userDataConfigs }: { userDataConfigs: userDataConfigs }) {
  const { plainPassword } = userDataZodSchemas(userDataConfigs)

  return object({
    newPassword: plainPassword,
    token: signed_token_schema,
  })
}
