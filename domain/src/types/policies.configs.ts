/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import '@moodle/lib-types'
declare global {
  namespace moo.def.policies.config {
    type tree = {
      [userType_ in names.userType]: userType<UserType[userType_]>
    }
    type userType<userType_ extends moo.def.userType> = config_tag<userType_> & {
      [contextName in string & keyof userType_]: userType_[contextName] extends moo.def.userType.model ? model<userType_[contextName]> : never
    }

    type model<model_ extends moo.def.userType.model> = config_tag<model_> & {
      [scopeName in string & keyof model_]: model_[scopeName] extends moo.def.userType.scope ? scope<model_[scopeName]> : never
    }

    type scope<scope_ extends moo.def.userType.scope> = config_tag<scope_> & {
      [useCaseName in string & keyof scope_]: scope_[useCaseName] extends moo.def.userType.usecase ? usecase<scope_[useCaseName]> : never
    }

    type usecase<usecase_ extends moo.def.userType.usecase = moo.def.userType.usecase> = config_tag<usecase_> & {
      [endpointName in string & keyof usecase_]: usecase_[endpointName] extends moo.def.userType.endpoint ? endpoint<def.userType.endpoint<usecase_[endpointName]>> : never
    }

    type endpoint<endpoint_ extends moo.def.userType.endpoint = moo.def.userType.endpoint> = config_tag<endpoint_>
  }
}
type config_tag<T> =
  T extends moo.def.tags<moo.def.tags.configs> ? (T[typeof moo.def.tags.configs] extends never | undefined ? { _?: never } : { _: T[typeof moo.def.tags.configs] }) : unknown
