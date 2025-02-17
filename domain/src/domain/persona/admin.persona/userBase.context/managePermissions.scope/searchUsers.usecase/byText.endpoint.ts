/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { email_address } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { flow } from 'fp-ts/function'
import { object } from 'zod'
import { Error4xx } from '../../../../../../lib/access-error'
import { anyPersonaZodFlow, anyPersonaZodSchemas } from '../../../../any.persona/any.gates.helper'

type foundUser = {
  id: string
  displayName: string
  email: email_address
  personaTypes: moo.personaType[]
}

export type byText = moo.persona.endpoint<[typeof byTextSchema, { users: foundUser[] }, void]>

export const byText: moo.gate.provider.endpoint<byText> = flow(
  O.some,
  O.bind(`anyPersonaZod`, ({ session }) => anyPersonaZodFlow({ session })),
  E.fromOption(() => new Error4xx('Unauthorized')),
  E.bind('zod', flow(E.right, E.map(byTextSchema))),
)

export function byTextSchema({ anyPersonaZod }: { anyPersonaZod: anyPersonaZodSchemas }) {
  return object({
    text: anyPersonaZod.textSearch,
  })
}
