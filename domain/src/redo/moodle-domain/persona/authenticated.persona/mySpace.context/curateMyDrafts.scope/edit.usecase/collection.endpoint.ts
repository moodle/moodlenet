/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { object } from 'zod'
import { error4xx } from '../../../../../../moo/lib/access-error'
import { anyPersonaZodFlow, anyPersonaZodSchemas } from '../../../../any.persona/any.gates.helper'
import { authenticatedPersonaZodFlow, authenticatedPersonaZodSchemas } from '../../../authenticated.gates.helper'

export type collection = moo.persona.endpoint<[typeof collectionSchema, void, void]>

export const collection: moo.gate.endpoint<collection> = flow(
  O.some,
  O.bind(`authenticatedZod`, ({ session }) => authenticatedPersonaZodFlow({ session })),
  O.bind(`anyZod`, ({ session }) => anyPersonaZodFlow({ session })),
  O.bind('zod', flow(O.some, O.map(collectionSchema))),
  E.fromOption(() => error4xx('Unauthorized')),
)

export function collectionSchema({
  authenticatedZod,
  anyZod,
}: {
  anyZod: anyPersonaZodSchemas
  authenticatedZod: authenticatedPersonaZodSchemas
}) {
  return object({
    id: anyZod.id,
    data: object({
      title: authenticatedZod.entity.title,
      description: authenticatedZod.entity.description,
    }),
  })
}
