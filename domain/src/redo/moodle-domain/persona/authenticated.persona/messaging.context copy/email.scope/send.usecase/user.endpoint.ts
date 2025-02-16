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
  E.fromOption(() => new Error4xx('Unauthorized')),
  E.bind('zod', flow(E.right, E.map(userSchema))),
)

export function userSchema({ anyZod }: { anyZod: anyPersonaZodSchemas }) {
  return object({
    id: anyZod.id,
  })
}
