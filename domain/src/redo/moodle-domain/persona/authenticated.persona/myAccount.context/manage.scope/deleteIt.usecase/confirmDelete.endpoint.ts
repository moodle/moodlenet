/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { signed_token_schema } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { object } from 'zod'
import { Error4xx } from '../../../../../../moo/lib/access-error'

export type confirmDelete = moo.persona.endpoint<[typeof confirmDeleteSchema, void, void]>

export const confirmDelete: moo.gate.endpoint<confirmDelete> = flow(
  O.some,
  O.bind('zod', flow(O.some, O.map(confirmDeleteSchema))),
  E.fromOption(() => new Error4xx('Unauthorized')),
)

export function confirmDeleteSchema() {
  return object({
    token: signed_token_schema,
  })
}
