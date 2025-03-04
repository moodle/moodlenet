/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { flow } from 'fp-ts/function'
import { object } from 'zod'
import { Error4xx } from '../../../../../../lib/access-error'
import { getPermissionsSchema } from '../../../../../model/accessControl.model/lib'
import { generalSchemaConfig } from '../../../../../model/org.model'
import { generalSchemas } from '../../../../../model/org.model/lib/schemas'

export type role = moo.persona.endpoint<[typeof roleSchema, void]>

export const role: moo.gate.provider.endpoint<role> = flow(
  O.some,
  O.bind(`general`, ({ permissionsInfo }) => O.fromNullable(permissionsInfo.tree.any?._.schemas.general)),
  E.fromOption(() => new Error4xx('Unauthorized')),
  E.bind('zod', flow(E.right, E.map(roleSchema))),
)

export function roleSchema({ general }: { general: generalSchemaConfig }) {
  return object({
    role: getPermissionsSchema().role,
    userId: generalSchemas({ general }).id,
  })
}
