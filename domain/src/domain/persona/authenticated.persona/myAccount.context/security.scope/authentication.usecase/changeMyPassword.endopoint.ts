/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { plain_password_schema } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { object, string } from 'zod'
import { Error4xx } from '../../../../../../lib/access-error'
import { anyPersonaZodFlow, anyPersonaZodSchemas } from '../../../../any.persona/any.gates.helper'

export type changeMyPassword = moo.persona.endpoint<[typeof changeMyPasswordSchema, void]>

export const changeMyPassword: moo.gate.provider.endpoint<changeMyPassword> = flow(
  O.some,
  O.bind(`anyPersonaZod`, ({ sessionInfo }) => anyPersonaZodFlow({ sessionInfo })),
  E.fromOption(() => new Error4xx('Unauthorized')),
  E.bind('zod', flow(E.right, E.map(changeMyPasswordSchema))),
)

export function changeMyPasswordSchema({ anyPersonaZod }: { anyPersonaZod: anyPersonaZodSchemas }) {
  return object({
    newPassword: anyPersonaZod.user.plainPassword,
    oldPassword: plain_password_schema(string()),
  })
}
