/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { url_string_schema } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { object } from 'zod'
import { error4xx } from '../../../../../../moo/lib/access-error'
import { anyPersonaZodFlow, anyPersonaZodSchemas } from '../../../../any.persona/any.gates.helper'

export type requestLink = moo.persona.endpoint<[typeof requestLinkSchema, void, void]>

export const requestLink_Gate: moo.gate.endpoint<requestLink> = flow(
  O.some,
  O.bind(`anyPersonaZod`, ({ session }) => anyPersonaZodFlow({ session })),
  O.bind('zod', flow(O.some, O.map(requestLinkSchema))),
  E.fromOption(() => error4xx('Unauthorized')),
)

export function requestLinkSchema({ anyPersonaZod }: { anyPersonaZod: anyPersonaZodSchemas }) {
  return object({
    redirectUrl: url_string_schema,
    myEmail: anyPersonaZod.user.email,
  })
}
