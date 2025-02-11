import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { string } from 'zod'
import { adminPersonaValidationConfigs } from './admin.persona'
export const adminPersonaConfigsFlow = flow(
  O.some<{ session: moo.session.user }>,
  O.flatMap(({ session }) => O.fromNullable(session.admin?._)),
)

export const adminPersonaZodFlow = flow(
  adminPersonaConfigsFlow,
  O.map(adminPersonaConfigs => adminPersonaZodSchemas(adminPersonaConfigs.validation)),
)

export type adminPersonaZodSchemas = ReturnType<typeof adminPersonaZodSchemas>
export function adminPersonaZodSchemas(adminPersonaValidationConfigs: adminPersonaValidationConfigs) {
  return {
    personaType: string()
      .max(adminPersonaValidationConfigs.personaType.max)
      .min(adminPersonaValidationConfigs.personaType.min),
  }
}
