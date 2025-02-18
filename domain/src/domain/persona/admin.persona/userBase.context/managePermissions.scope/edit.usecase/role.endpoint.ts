/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { flow } from 'fp-ts/function'
import { object } from 'zod'
import { Error4xx } from '../../../../../../lib/access-error'
import { anyPersonaZodFlow, anyPersonaZodSchemas } from '../../../../any.persona/any.gates.helper'
import { adminPersonaZodFlow, adminPersonaZodSchemas } from '../../../admin.gates.helper'

export type role = moo.persona.endpoint<[typeof roleSchema, void]>

export const role: moo.gate.provider.endpoint<role> = flow(
  O.some,
  O.bind(`anyPersonaZod`, ({ sessionInfo }) => anyPersonaZodFlow({ sessionInfo })),
  O.bind(`adminPersonaZod`, ({ sessionInfo }) => adminPersonaZodFlow({ sessionInfo })),
  O.bind('zod', ({ adminPersonaZod, anyPersonaZod }) => O.some(roleSchema({ adminPersonaZod, anyPersonaZod }))),
  E.fromOption(() => new Error4xx('Unauthorized')),
)

export function roleSchema({
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
