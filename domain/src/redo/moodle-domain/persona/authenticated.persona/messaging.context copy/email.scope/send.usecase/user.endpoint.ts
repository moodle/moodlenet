/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { object } from 'zod'
import { Error4xx } from '../../../../../../moo/lib/access-error'
import { anyPersonaZodFlow, anyPersonaZodSchemas } from '../../../../any.persona/any.gates.helper'

export type user = moo.persona.endpoint<[typeof userSchema, void]>

export const user: moo.gate.provider.endpoint<user> = flow(
  O.some,
  O.bind(`anyZod`, ({ session }) => anyPersonaZodFlow({ session })),
  O.bind('zod', flow(O.some, O.map(userSchema))),
  E.fromOption(() => new Error4xx('Unauthorized')),
)

export function userSchema({ anyZod }: { anyZod: anyPersonaZodSchemas }) {
  return object({
    id: anyZod.id,
  })
}
