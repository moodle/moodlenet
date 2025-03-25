/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { object } from 'zod'
import { Error4xx } from '../../../../../../lib/access-error'
import { generalSchemaConfig } from '../../../../../model/org.model'
import { generalSchemas } from '../../../../../model/org.model/lib/schemas'

export type read = moo.persona.endpoint<[typeof readSchema, void]>

export const read: moo.gate.provider.endpoint<read> = flow(
  O.some,
  O.bind(`general`, ({ permissionsInfo }) => O.fromNullable(permissionsInfo.tree.any?._.schemas.general)),
  E.fromOption(() => new Error4xx('Unauthorized')),
  E.bind('zod', flow(E.right, E.map(readSchema))),
)

export function readSchema({ general }: { general: generalSchemaConfig }) {
  return object({
    id: generalSchemas({ general }).id,
  })
}
