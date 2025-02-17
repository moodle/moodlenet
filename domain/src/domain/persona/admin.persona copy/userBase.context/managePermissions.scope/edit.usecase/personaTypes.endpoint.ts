/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { flow } from 'fp-ts/function'
import { object } from 'zod'
import { Error4xx } from '../../../../../../lib/access-error'
import { anyPersonaZodFlow, anyPersonaZodSchemas } from '../../../../any.persona/any.gates.helper'
import { adminPersonaZodFlow, adminPersonaZodSchemas } from '../../../../admin.persona/admin.gates.helper'

export type personaTypes = moo.persona.endpoint<[typeof personaTypesSchema, void]>

export const personaTypes: moo.gate.provider.endpoint<personaTypes> = flow(
  O.some,
  O.bind(`anyPersonaZod`, ({ session }) => anyPersonaZodFlow({ session })),
  O.bind(`adminPersonaZod`, ({ session }) => adminPersonaZodFlow({ session })),
  O.bind('zod', ({ adminPersonaZod, anyPersonaZod }) => O.some(personaTypesSchema({ adminPersonaZod, anyPersonaZod }))),
  E.fromOption(() => new Error4xx('Unauthorized')),
)

export function personaTypesSchema({
  adminPersonaZod,
  anyPersonaZod,
}: {
  anyPersonaZod: anyPersonaZodSchemas
  adminPersonaZod: adminPersonaZodSchemas
}) {
  return object({
    role: adminPersonaZod.role,
    userId: anyPersonaZod.id,
  })
}
