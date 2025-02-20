import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { literal } from 'zod'
import { adminPersonaValidationConfigs } from '.'
export const adminPersonaConfigsFlow = flow(
  O.some<{ sessionInfo: moo.session.info }>,
  O.flatMap(({ sessionInfo }) => O.fromNullable(sessionInfo.session.admin?._)),
)

export const adminPersonaZodFlow = flow(
  adminPersonaConfigsFlow,
  O.map(adminPersonaConfigs => adminPersonaZodSchemas(adminPersonaConfigs.validation)),
)

export type adminPersonaZodSchemas = ReturnType<typeof adminPersonaZodSchemas>
export function adminPersonaZodSchemas(_adminPersonaValidationConfigs: adminPersonaValidationConfigs) {

}
