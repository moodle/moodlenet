/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */

import { any_, date_time_string, map } from '@moodle/lib-types'
import { logger } from './log'

declare global {
  namespace moo.def {
    type core = core.def<UserTypes>
    namespace core {
      type def<forUserTypes extends map<moo.def.userType<any_>> = UserTypes> = {
        [userType_ in keyof forUserTypes]: userType<forUserTypes[userType_]>
      }
      type userType<userType_ extends moo.def.userType<any_>> = {
        [contextName in string & keyof userType_]: userType_[contextName] extends moo.def.userType.context<any_> ? context<userType_[contextName]> : unknown
      }

      type context<context extends moo.def.userType.context<any_>> = {
        [scopeName in string & keyof context]: context[scopeName] extends moo.def.userType.scope<any_> ? scope<context[scopeName]> : unknown
      }

      type scope<scope extends moo.def.userType.scope<any_>> = {
        [useCaseName in string & keyof scope]: scope[useCaseName] extends moo.def.userType.usecase<any_> ? usecase<scope[useCaseName]> : never
      }

      type usecase<useCase extends moo.def.userType.usecase<any_>> = {
        [endpointName in string & keyof useCase]: useCase[endpointName] extends moo.def.userType.endpoint<any_> ? endpoint<useCase[endpointName]> : never
      }

      type request<endpoint_ extends def.userType.endpoint<any_> = def.userType.endpoint<any_>> = {
        id: string
        now: date_time_string
        policiesInfo: def.policies.user.info
        gateRequest: def.gate.provider.request<endpoint_>
      }

      type ctx<endpoint_ extends def.userType.endpoint<any_>> = {
        model: moo.def.model.handle
        configs: endpoint_[2]
        log: logger
        coreRequest: request<endpoint_>
        assertContextChecks: endpoint_[3] extends never | undefined | null | void
          ? undefined
          : (context: endpoint_[3] extends never | undefined | null | void ? void : endpoint_[3]) => /* Error4xx |  */ undefined
        zod: def.gate.endpointZod<endpoint_>
      }
      type endpointArgs<endpoint_ extends def.userType.endpoint<any_>> = [form: def.gate.provider.request<endpoint_>['form'], ctx: ctx<endpoint_>]

      type endpoint<endpoint_ extends def.userType.endpoint<any_>> = (...endpointArgs: endpointArgs<endpoint_>) => Promise<endpoint_[1]>
    }
  }
}
