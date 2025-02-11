/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { email_address } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { flow } from 'fp-ts/function'
import { object } from 'zod'
import { error4xx } from '../../../../../../moo/lib/access-error'
import { anyPersonaZodFlow, anyPersonaZodSchemas } from '../../../../any.persona/any.gates.helper'

type foundUser = {
  id: string
  displayName: string
  email: email_address
  personaTypes: moo.personaType[]
}

export type searchUsersByText = moo.persona.endpoint<[typeof searchUsersByTextSchema, { users: foundUser[] }, void]>

export const searchUsersByText_Gate: moo.gate.endpoint<searchUsersByText> = flow(
  O.some,
  O.bind(`anyPersonaZod`, ({ session }) => anyPersonaZodFlow({ session })),
  O.bind('zod', flow(O.some, O.map(searchUsersByTextSchema))),
  E.fromOption(() => error4xx('Unauthorized')),
)

export function searchUsersByTextSchema({ anyPersonaZod }: { anyPersonaZod: anyPersonaZodSchemas }) {
  return object({
    text: anyPersonaZod.textSearch,
  })
}
