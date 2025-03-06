/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import '@moodle/lib-types'
import { any_ } from '@moodle/lib-types'
declare global {
  namespace moo {
    namespace permissions {
      namespace config {
        type tree = {
          [personaType_ in personaType]: persona<Personas[personaType_]>
        }
        type persona<persona_ extends moo.persona<any_>> = config_tag<persona_> & {
          [contextName in string & keyof persona_]: persona_[contextName] extends moo.persona.context<any_> ? context<persona_[contextName]> : never
        }

        type context<context_ extends moo.persona.context<any_>> = config_tag<context_> & {
          [scopeName in string & keyof context_]: context_[scopeName] extends moo.persona.scope<any_> ? scope<context_[scopeName]> : never
        }

        type scope<scope_ extends moo.persona.scope<any_>> = config_tag<scope_> & {
          [useCaseName in string & keyof scope_]: scope_[useCaseName] extends moo.persona.usecase<any_> ? usecase<scope_[useCaseName]> : never
        }

        type usecase<usecase_ extends moo.persona.usecase<any_>> = config_tag<usecase_> & {
          [endpointName in string & keyof usecase_]: usecase_[endpointName] extends moo.persona.endpoint<any_> ? endpoint<persona.endpoint<usecase_[endpointName]>> : never
        }

        type endpoint<endpoint_ extends moo.persona.endpoint<any_>> = endpoint_[2] extends undefined | void | never
          ? Record<string, never>
          : {
              _: endpoint_[2]
            }
      }
    }
  }
}
type config_tag<T> = T extends moo.tags<moo.tags.configs> ? (T[typeof moo.tags.configs] extends never | undefined ? { _?: never } : { _: T[typeof moo.tags.configs] }) : unknown
