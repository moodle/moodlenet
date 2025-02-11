/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { url_string_schema } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { object } from 'zod'
import { error4xx } from '../../../../../../moo/lib/access-error'
import { userDataConfigs } from '../../../../../model/userAccount.model/userAccount.model'
import { generalUserDataConfigsFlow } from '../../../../any.persona/any.gates.helper'
import { userDataZodSchemas } from '../../../../any.persona/any.persona'

export type requestLink = moo.persona.endpoint<[typeof requestLinkSchema, void, void]>

export const requestLink_Gate: moo.gate.endpointProvider<requestLink> = flow(
  generalUserDataConfigsFlow,
  O.bind('zod', flow(O.some, O.map(requestLinkSchema))),
  E.fromOption(() => error4xx('Unauthorized')),
)

export function requestLinkSchema({ userDataConfigs }: { userDataConfigs: userDataConfigs }) {
  const { userEmail } = userDataZodSchemas(userDataConfigs)

  return object({
    redirectUrl: url_string_schema,
    myEmail: userEmail,
  })
}
