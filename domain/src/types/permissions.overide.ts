/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import '@moodle/lib-types'
import { any_, deep_partial_props } from '@moodle/lib-types'
declare global {
  namespace moo {
    namespace permissions {
      namespace override {
        type tree = {
          [personaType_ in personaType]?: persona<Personas[personaType_]>
        }
        type persona<persona_ extends moo.persona<any_>> =
          // | nodeDir
          config_tag<persona_> & {
            [contextName in string & keyof persona_]?: persona_[contextName] extends moo.persona.context<any_> ? context<persona_[contextName]> : never
          }

        type context<context_ extends moo.persona.context<any_>> =
          // | nodeDir
          config_tag<context_> & {
            [scopeName in string & keyof context_]?: context_[scopeName] extends moo.persona.scope<any_> ? scope<context_[scopeName]> : never
          }

        type scope<scope_ extends moo.persona.scope<any_>> =
          // | nodeDir
          config_tag<scope_> & {
            [useCaseName in string & keyof scope_]?: scope_[useCaseName] extends moo.persona.usecase<any_> ? usecase<scope_[useCaseName]> : never
          }

        type usecase<usecase_ extends moo.persona.usecase<any_>> =
          // | nodeDir
          config_tag<usecase_> & {
            [endpointName in string & keyof usecase_]?: usecase_[endpointName] extends moo.persona.endpoint<any_> ? endpoint<persona.endpoint<usecase_[endpointName]>> : never
          }

        type endpoint<endpoint_ extends moo.persona.endpoint<any_>> =
          // | nodeDir
          config_tag<{ [moo.tags.configs]: endpoint_[2] }>
      }
    }
  }
}

// type nodeDir = undefined | [nodeDirType: nodeDirType]
// type nodeDirType = 'ALLOW' | 'DENY'

type config_tag<T> = T extends moo.tags<moo.tags.configs> ? { _?: deep_partial_props<T[typeof moo.tags.configs]> } : unknown
