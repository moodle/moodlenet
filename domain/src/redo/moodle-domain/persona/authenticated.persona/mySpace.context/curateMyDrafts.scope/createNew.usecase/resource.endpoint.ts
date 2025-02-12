/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { object } from 'zod'
import { error4xx } from '../../../../../../moo/lib/access-error'
import { authenticatedPersonaZodFlow, authenticatedPersonaZodSchemas } from '../../../authenticated.gates.helper'

export type resource = moo.persona.endpoint<[typeof resourceSchema, void, void]>

export const resource: moo.gate.endpoint<resource> = flow(
  O.some,
  O.bind(`authenticatedZod`, ({ session }) => authenticatedPersonaZodFlow({ session })),
  O.bind('zod', flow(O.some, O.map(resourceSchema))),
  E.fromOption(() => error4xx('Unauthorized')),
)

export function resourceSchema({ authenticatedZod }: { authenticatedZod: authenticatedPersonaZodSchemas }) {
  return object({
    title: authenticatedZod.entity.title,
    description: authenticatedZod.entity.description,
  })
}
