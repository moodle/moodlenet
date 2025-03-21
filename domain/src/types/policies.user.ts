/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import '@moodle/lib-types'
import { d_u, date_time_string } from '@moodle/lib-types'
declare global {
  namespace moo.def.policies.user {
    // type tree = {
    //   [userType_ in names.userType]?: userType<UserType[userType_]>
    // }
    type tree = branch<UserType>

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

    type branch<branch_> = config_tag<branch_> &
      (branch_ extends moo.def.userType.endpoint
        ? unknown
        : {
            [key in string & keyof branch_]?: branch<branch_[key]>
          })

    type userType<userType_ extends moo.def.userType> =
      /* context_tag<userType_> & */
      config_tag<userType_> & {
        [contextName in string & keyof userType_]?: userType_[contextName] extends moo.def.userType.model ? context<userType_[contextName]> : never
      }

    type context<context_ extends moo.def.userType.model> = config_tag<context_> & {
      [scopeName in string & keyof context_]?: context_[scopeName] extends moo.def.userType.scope ? scope<context_[scopeName]> : never
    }

    type scope<scope_ extends moo.def.userType.scope> = config_tag<scope_> & {
      [useCaseName in string & keyof scope_]?: scope_[useCaseName] extends moo.def.userType.usecase ? usecase<scope_[useCaseName]> : never
    }

    type usecase<usecase_ extends moo.def.userType.usecase> = config_tag<usecase_> & {
      [endpointName in string & keyof usecase_]?: usecase_[endpointName] extends moo.def.userType.endpoint ? endpoint<def.userType.endpoint<usecase_[endpointName]>> : never
    }

    type endpoint<endpoint_ extends moo.def.userType.endpoint> = config_tag<endpoint_>
  }
}
type config_tag<T> =
  T extends moo.def.tags<moo.def.tags.configs> ? (T[typeof moo.def.tags.configs] extends never | undefined ? { _?: never | undefined } : { _: T[moo.def.tags.configs] }) : unknown

// type context_tag<T> = T extends moo.def.userType.withContext
//   ? T[typeof moo.def.userType.context] extends never | undefined
//     ? { $?: never }
//     : { $: T[typeof moo.def.userType.context] }
//   : unknown
