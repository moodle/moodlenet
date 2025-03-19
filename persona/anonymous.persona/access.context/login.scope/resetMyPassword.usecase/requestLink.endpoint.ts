/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { url_string_schema } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { object } from 'zod'
import { Error4xx } from '../../../../../../lib/access-error'
import { generalSchemaConfig } from '../../../../../model/org.model'
import { generalSchemas } from '../../../../../model/org.model/lib/schemas'

export type requestLink = moo.persona.endpoint<[typeof requestLinkSchema, void]>
export const requestLink: moo.gate.provider.endpoint<requestLink> = flow(
  O.some,
  O.bind(`general`, ({ permissionsInfo }) => O.fromNullable(permissionsInfo.tree.any?._.schemas.general)),
  E.fromOption(() => new Error4xx('Forbidden')),
  E.bind('zod', flow(E.right, E.map(requestLinkSchema))),
)

export function requestLinkSchema({ general }: { general: generalSchemaConfig }) {
  const generalSchema = generalSchemas({ general })
  return object({
    redirectUrl: url_string_schema,
    myEmail: generalSchema.email,
  })
}
