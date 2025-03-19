/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { object } from 'zod'
import { Error4xx } from '../../../../../../lib/access-error'
import { generalSchemaConfig } from '../../../../../model/org.model'
import { generalSchemas } from '../../../../../model/org.model/lib/schemas'

export type setAvatar = moo.persona.endpoint<[typeof setAvatarSchema, void]>

export const setAvatar: moo.gate.provider.endpoint<setAvatar> = flow(
  O.some,
  O.bind(`general`, ({ permissionsInfo }) => O.fromNullable(permissionsInfo.tree.any?._.schemas.general)),
  E.fromOption(() => new Error4xx('Unauthorized')),
  E.bind('zod', flow(E.right, E.map(setAvatarSchema))),
)

export function setAvatarSchema({ general }: { general: generalSchemaConfig }) {
  return object({
    id: generalSchemas({ general }).id,
  })
}
