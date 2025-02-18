/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { url_string_schema } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { object } from 'zod'
import { Error4xx } from '../../../../../../lib/access-error'
import { anyPersonaZodFlow, anyPersonaZodSchemas } from '../../../../any.persona/any.gates.helper'

export type request = moo.persona.endpoint<[typeof requestSchema, void]>

export const request: moo.gate.provider.endpoint<request> = flow(
  O.some,
  O.bind(`anyPersonaZod`, ({ sessionInfo }) => anyPersonaZodFlow({ sessionInfo })),
  E.fromOption(() => new Error4xx('Unauthorized')),
  E.bind('zod', flow(E.right, E.map(requestSchema))),
)

export function requestSchema({ anyPersonaZod }: { anyPersonaZod: anyPersonaZodSchemas }) {
  return object({
    redirectUrl: url_string_schema,
    myEmail: anyPersonaZod.user.email,
  })
}
