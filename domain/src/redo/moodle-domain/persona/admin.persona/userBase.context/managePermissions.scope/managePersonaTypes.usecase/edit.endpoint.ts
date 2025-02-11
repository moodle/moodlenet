/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { email_address } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { flow } from 'fp-ts/function'
import { array, object } from 'zod'
import { error4xx } from '../../../../../../moo/lib/access-error'
import { anyPersonaZodFlow, anyPersonaZodSchemas } from '../../../../any.persona/any.gates.helper'
import { adminPersonaZodFlow, adminPersonaZodSchemas } from '../../../admin.gates.helper'

type foundUser = {
  id: string
  displayName: string
  email: email_address
}

export type edit = moo.persona.endpoint<[typeof editSchema, { users: foundUser[] }, void]>

export const edit_Gate: moo.gate.endpoint<edit> = flow(
  O.some,
  O.bind(`anyPersonaZod`, ({ session }) => anyPersonaZodFlow({ session })),
  O.bind(`adminPersonaZod`, ({ session }) => adminPersonaZodFlow({ session })),
  O.bind('zod', ({ adminPersonaZod, anyPersonaZod }) => O.some(editSchema({ adminPersonaZod, anyPersonaZod }))),
  E.fromOption(() => error4xx('Unauthorized')),
)

export function editSchema({
  adminPersonaZod,
  anyPersonaZod,
}: {
  anyPersonaZod: anyPersonaZodSchemas
  adminPersonaZod: adminPersonaZodSchemas
}) {
  return object({
    personaTypes: array(adminPersonaZod.personaType),
    userId: anyPersonaZod.id,
  })
}
