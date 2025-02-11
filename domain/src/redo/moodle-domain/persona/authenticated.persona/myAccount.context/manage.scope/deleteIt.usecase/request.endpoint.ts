/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { url_string_schema } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { object } from 'zod'
import { error4xx } from '../../../../../../moo/lib/access-error'
import { baseUserDataValidationConfigs } from '../../../../../model/userAccount.model/userAccount.model'
import { baseUserDataValidationConfigsFlow } from '../../../../any.persona/any.gates.helper'
import { anyPersonaZodSchemas } from '../../../../any.persona/any.persona'

export type request = moo.persona.endpoint<[typeof requestSchema, void, void]>

export const request_Gate: moo.gate.endpoint<request> = flow(
  baseUserDataValidationConfigsFlow,
  O.bind('zod', flow(O.some, O.map(requestSchema))),
  E.fromOption(() => error4xx('Unauthorized')),
)

export function requestSchema({ baseUserDataConfigs }: { baseUserDataConfigs: baseUserDataValidationConfigs }) {
  const { userEmail } = anyPersonaZodSchemas(baseUserDataConfigs)

  return object({
    redirectUrl: url_string_schema,
    myEmail: userEmail,
  })
}
