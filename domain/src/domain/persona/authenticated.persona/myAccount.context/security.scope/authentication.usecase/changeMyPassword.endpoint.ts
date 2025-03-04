/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { plain_password_schema } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { object, string } from 'zod'
import { Error4xx } from '../../../../../../lib/access-error'
import { baseUserDataSchemas } from '../../../../../model/org.model/lib/schemas'
import { baseUserDataSchemaConfig } from '../../../../../model/org.model'

export type changeMyPassword = moo.persona.endpoint<[typeof changeMyPasswordSchema, void]>

export const changeMyPassword: moo.gate.provider.endpoint<changeMyPassword> = flow(
  O.some,
  O.bind(`baseUserData`, ({ permissionsInfo }) => O.fromNullable(permissionsInfo.tree.any?._.schemas.baseUserData)),
  E.fromOption(() => new Error4xx('Unauthorized')),
  E.bind('zod', flow(E.right, E.map(changeMyPasswordSchema))),
)

export function changeMyPasswordSchema({ baseUserData }: { baseUserData: baseUserDataSchemaConfig }) {
  return object({
    newPassword: baseUserDataSchemas({ baseUserData }).password,
    oldPassword: plain_password_schema(string()),
  })
}
