/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import '@moodle/lib-types'
import { any_, d_u, date_time_string } from '@moodle/lib-types'
declare global {
  namespace moo {
    namespace permissions {
      namespace user {
        type tree = {
          [personaType_ in personaType]?: user.persona<Personas[personaType_]>
        }
        type info = {
          user: info.user
          tree: tree
          revDate: date_time_string
        }
        namespace info {
          type user = d_u<
            {
              auth: { id: string }
              anon: unknown
            },
            'type'
          >
        }
        type persona<persona_ extends moo.persona<any_>> = context_tag<persona_> &
          config_tag<persona_> & {
            [contextName in string & keyof persona_]?: persona_[contextName] extends moo.persona.context<any_> ? context<persona_[contextName]> : never
          }

        type context<context extends moo.persona.context<any_>> = config_tag<context> & {
          [scopeName in string & keyof context]?: context[scopeName] extends moo.persona.scope<any_> ? scope<context[scopeName]> : never
        }

        type scope<scope extends moo.persona.scope<any_>> = config_tag<scope> & {
          [useCaseName in string & keyof scope]?: scope[useCaseName] extends moo.persona.usecase<any_> ? usecase<scope[useCaseName]> : never
        }

        type usecase<useCase extends moo.persona.usecase<any_>> = config_tag<useCase> & {
          [endpointName in string & keyof useCase]?: useCase[endpointName] extends moo.persona.endpoint<any_> ? endpoint<persona.endpoint<useCase[endpointName]>> : never
        }

        type endpoint<useCaseEndpoint extends moo.persona.endpoint<any_>> = useCaseEndpoint[2] extends undefined | void | never
          ? Record<string, never>
          : {
              _: useCaseEndpoint[2]
            }
      }
    }
  }
}
type config_tag<T> = T extends moo.tags<moo.tags.configs> ? (T[typeof moo.tags.configs] extends never | undefined ? { _?: never } : { _: T[typeof moo.tags.configs] }) : unknown

type context_tag<T> = T extends moo.persona.withContext ? (T[typeof moo.persona.context] extends never | undefined ? { $?: never } : { $: T[typeof moo.persona.context] }) : unknown
