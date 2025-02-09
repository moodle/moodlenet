/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import '@moodle/lib-types'
import { any_ } from '@moodle/lib-types'

declare global {
  namespace moo {
    type permissions<partial extends boolean> = {
      [personaType in keyof Personas]:
        | (partial extends true ? undefined : never)
        | permissions.persona<Personas[personaType], partial>
    }
    namespace permissions {
      type configs = permissions<false>
      type user = permissions<true>
      type persona<persona_ extends moo.persona<any_>, partial extends boolean> = dir_tag<persona_> & {
        [contextName in string & keyof persona_]:
          | (partial extends true ? undefined : never)
          | (persona_[contextName] extends moo.persona.context ? permissions.context<persona_[contextName], partial> : never)
      }

      type context<context extends moo.persona.context, partial extends boolean> = dir_tag<context> & {
        [scopeName in string & keyof context]:
          | (partial extends true ? undefined : never)
          | (context[scopeName] extends moo.persona.scope ? permissions.scope<context[scopeName], partial> : never)
      }

      type scope<scope extends moo.persona.scope, partial extends boolean> = dir_tag<scope> & {
        [useCaseName in string & keyof scope]:
          | (partial extends true ? undefined : never)
          | (scope[useCaseName] extends moo.persona.usecase ? permissions.UseCase<scope[useCaseName], partial> : never)
      }

      type UseCase<useCase extends moo.persona.usecase, partial extends boolean> = dir_tag<useCase> & {
        [endpointName in string & keyof useCase]:
          | (partial extends true ? undefined : never)
          | permissions.Endpoint<persona.endpoint<useCase[endpointName]>>
      }

      type Endpoint<useCaseEndpoint extends moo.persona.endpoint> = useCaseEndpoint[2] extends undefined | void | never
        ? Record<string, never>
        : {
            _: useCaseEndpoint[2]
          }
    }
  }
}
type dir_tag<T> = T extends moo.persona.withDirectives
  ? T[typeof moo.persona.directives] extends never
    ? { _?: never }
    : { _: T[typeof moo.persona.directives] }
  : unknown
