/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { signed_token_schema } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { object } from 'zod'
import { Error4xx } from '../../../../../../moo/lib/access-error'
import { anyPersonaZodFlow, anyPersonaZodSchemas } from '../../../../any.persona/any.gates.helper'

export type setNew = moo.persona.endpoint<[typeof setNewSchema, void]>

export const setNew: moo.gate.endpoint<setNew> = flow(
  O.some,
  O.bind(`anyPersonaZod`, ({ session }) => anyPersonaZodFlow({ session })),
  O.bind('zod', flow(O.some, O.map(setNewSchema))),
  E.fromOption(() => new Error4xx('Unauthorized')),
)

export function setNewSchema({ anyPersonaZod }: { anyPersonaZod: anyPersonaZodSchemas }) {
  return object({
    newPassword: anyPersonaZod.user.plainPassword,
    token: signed_token_schema,
  })
}
