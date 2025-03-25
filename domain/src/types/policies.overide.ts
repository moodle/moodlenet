/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import '@moodle/lib-types'
import { deep_partial_props } from '@moodle/lib-types'
declare global {
  namespace moo.def.policies.override {
    type tree = {
      [userType_ in names.userType]?: userType<UserType[userType_]>
    }
    type userType<userType_ extends moo.def.userType> =
      // | nodeDir
      config_tag<userType_> & {
        [contextName in string & keyof userType_]?: userType_[contextName] extends moo.def.userType.model ? context<userType_[contextName]> : never
      }

    type context<context_ extends moo.def.userType.model> =
      // | nodeDir
      config_tag<context_> & {
        [scopeName in string & keyof context_]?: context_[scopeName] extends moo.def.userType.scope ? scope<context_[scopeName]> : never
      }

    type scope<scope_ extends moo.def.userType.scope> =
      // | nodeDir
      config_tag<scope_> & {
        [useCaseName in string & keyof scope_]?: scope_[useCaseName] extends moo.def.userType.usecase ? usecase<scope_[useCaseName]> : never
      }

    type usecase<usecase_ extends moo.def.userType.usecase> =
      // | nodeDir
      config_tag<usecase_> & {
        [endpointName in string & keyof usecase_]?: usecase_[endpointName] extends moo.def.userType.endpoint ? endpoint<def.userType.endpoint<usecase_[endpointName]>> : never
      }

    type endpoint<endpoint_ extends moo.def.userType.endpoint> =
      // | nodeDir
      config_tag<endpoint_>
  }
}

// type nodeDir = undefined | [nodeDirType: nodeDirType]
// type nodeDirType = 'ALLOW' | 'DENY'

type config_tag<T> = T extends moo.def.tags<moo.def.tags.configs> ? { _?: deep_partial_props<T[typeof moo.def.tags.configs]> } : unknown
