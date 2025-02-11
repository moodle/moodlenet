/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { plain_password_schema } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { object, string } from 'zod'
import { error4xx } from '../../../../../../moo/lib/access-error'
import { baseUserDataValidationConfigs } from '../../../../../model/userAccount.model/userAccount.model'
import { baseUserDataValidationConfigsFlow } from '../../../../any.persona/any.gates.helper'
import { anyPersonaZodSchemas } from '../../../../any.persona/any.persona'

export type changeMyPassword = moo.persona.endpoint<[typeof changeMyPasswordSchema, void, void]>

export const changeMyPassword_Gate: moo.gate.endpoint<changeMyPassword> = flow(
  baseUserDataValidationConfigsFlow,
  O.bind('zod', flow(O.some, O.map(changeMyPasswordSchema))),
  E.fromOption(() => error4xx('Unauthorized')),
)

export function changeMyPasswordSchema({ baseUserDataConfigs }: { baseUserDataConfigs: baseUserDataValidationConfigs }) {
  const { plainPassword } = anyPersonaZodSchemas(baseUserDataConfigs)

  return object({
    newPassword: plainPassword,
    oldPassword: plain_password_schema(string()),
  })
}
