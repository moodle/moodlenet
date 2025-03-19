/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { email_address } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { flow } from 'fp-ts/function'
import { object } from 'zod'
import { Error4xx } from '../../../../../../lib/access-error'
import { generalSchemaConfig } from '../../../../../model/org.model'
import { generalSchemas } from '../../../../../model/org.model/lib/schemas'

type foundUser = {
  id: string
  displayName: string
  email: email_address
  personaTypes: moo.personaType[]
}

export type byText = moo.persona.endpoint<[typeof byTextSchema, { users: foundUser[] }, void]>

export const byText: moo.gate.provider.endpoint<byText> = flow(
  O.some,
  O.bind(`general`, ({ permissionsInfo }) => O.fromNullable(permissionsInfo.tree.any?._.schemas.general)),
  E.fromOption(() => new Error4xx('Unauthorized')),
  E.bind('zod', flow(E.right, E.map(byTextSchema))),
)

export function byTextSchema({ general }: { general: generalSchemaConfig }) {
  return object({
    text: generalSchemas({ general }).textSearch,
  })
}
