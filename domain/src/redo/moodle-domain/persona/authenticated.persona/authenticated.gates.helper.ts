import { single_line_string_schema } from '@moodle/lib-types'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { string } from 'zod'
import { authenticatedPersonaValidationConfigs } from '.'
export const authenticatedPersonaConfigsFlow = ({ session }: { session: moo.session.user }) =>
  O.fromNullable(session.authenticated?._)

export const authenticatedPersonaZodFlow = flow(
  authenticatedPersonaConfigsFlow,
  O.map(authenticatedPersonaConfigs => authenticatedPersonaZodSchemas(authenticatedPersonaConfigs.validation)),
)

export type authenticatedPersonaZodSchemas = ReturnType<typeof authenticatedPersonaZodSchemas>
export function authenticatedPersonaZodSchemas(configs: authenticatedPersonaValidationConfigs) {
  const entity = {
    description: string().trim().max(configs.entity.description.max).min(configs.entity.description.min),
    title: string().trim().max(configs.entity.title.max).min(configs.entity.title.min).pipe(single_line_string_schema),
  }
  // const webImageAsset = {

  // }

  return {
    entity,
  }
}
