/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { signed_token_schema } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { object } from 'zod'
import { error4xx } from '../../../../../../moo/lib/access-error'
import { baseUserDataValidationConfigsFlow } from '../../../../any.persona/any.gates.helper'

export type confirmDelete = moo.persona.endpoint<[typeof confirmDeleteSchema, void, void]>

export const confirmDelete_Gate: moo.gate.endpoint<confirmDelete> = flow(
  baseUserDataValidationConfigsFlow,
  O.bind('zod', flow(O.some, O.map(confirmDeleteSchema))),
  E.fromOption(() => error4xx('Unauthorized')),
)

export function confirmDeleteSchema() {
  return object({
    token: signed_token_schema,
  })
}
