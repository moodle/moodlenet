/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { signed_token_schema } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { object } from 'zod'
import { Error4xx } from '../../../../../../lib/access-error'
import { baseUserDataSchemaConfig } from '../../../../../model/org.model'
import { baseUserDataSchemas } from '../../../../../model/org.model/lib/schemas'

export type setNew = moo.persona.endpoint<[typeof setNewSchema, void]>

export const setNew: moo.gate.provider.endpoint<setNew> = flow(
  O.some,
  O.bind(`baseUserData`, ({ permissionsInfo }) => O.fromNullable(permissionsInfo.tree.any?._.schemas.baseUserData)),
  E.fromOption(() => new Error4xx('Forbidden')),
  E.bind('zod', flow(E.right, E.map(setNewSchema))),
)

export function setNewSchema({ baseUserData }: { baseUserData: baseUserDataSchemaConfig }) {
  const baseUserDataSchema = baseUserDataSchemas({ baseUserData })
  return object({
    newPassword: baseUserDataSchema.password,
    token: signed_token_schema,
  })
}
