/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */

import { date_time_string, map } from '@moodle/lib-types'
import { logger } from './log'

declare global {
  namespace moo.def {
    type core2 = core2.def
    namespace core2 {
      type def<forUserTypes extends map<moo.def.userType> = moo<UserType>> = {
        [userType_ in keyof forUserTypes]: userType<forUserTypes[userType_]>
      }
      type userType<userType_ extends moo.def.userType> = {
        [contextName in string & keyof userType_]: userType_[contextName] extends moo.def.userType.model ? model<userType_[contextName]> : unknown
      }

      type model<model_ extends moo.def.userType.model> = (_: modelCtx<model_>) => {
        [scopeName in string & keyof model_]: model_[scopeName] extends moo.def.userType.scope ? scope<model_[scopeName]> : unknown
      }
      type modelCtx<model_ extends moo.def.userType.model> = {
        model: moo.def.model.handle
        log: logger
        coreRequest: request
        modelConfigs: tagType<model_, tags.configs>
      }

      type scope<scope_ extends moo.def.userType.scope> = (_: scopeCtx<scope_>) => {
        [useCaseName in string & keyof scope_]: scope_[useCaseName] extends moo.def.userType.usecase ? usecase<scope_[useCaseName]> : never
      }
      type scopeCtx<scope_ extends moo.def.userType.scope> = { scopeConfigs: tagType<scope_, tags.configs> }

      type usecase<usecase_ extends moo.def.userType.usecase> = (_: usecaseCtx<usecase_>) => {
        [endpointName in string & keyof usecase_]: usecase_[endpointName] extends moo.def.userType.endpoint ? endpoint<usecase_[endpointName]> : never
      }
      type usecaseCtx<usecase_ extends moo.def.userType.usecase> = {
        usecaseConfigs: tagType<usecase_, tags.configs>
        assertCheckUsecaseContext: tagType<usecase_, tags.configs> extends never | undefined | null | void
          ? undefined
          : (context: tagType<usecase_, tags.configs> extends never | undefined | null | void ? void : tagType<usecase_, tags.configs>) => /* Error4xx |  */ undefined
      }

      type request<endpoint_ extends def.userType.endpoint = def.userType.endpoint> = {
        id: string
        now: date_time_string
        policiesInfo: def.policies.user.info
        gateRequest: def.gate.provider.request<endpoint_>
      }

      type endpointCtx<endpoint_ extends def.userType.endpoint> = {
        endpointConfigs: tagType<endpoint_, tags.configs>
        coreRequest: request<endpoint_>
        assertCheckEndpointContext: tagType<endpoint_, tags.context> extends never | undefined | null | void
          ? undefined
          : (context: tagType<endpoint_, tags.context> extends never | undefined | null | void ? void : tagType<endpoint_, tags.context>) => /* Error4xx |  */ undefined
        zod: userType.enpointZodType<endpoint_>
      }
      type endpointArgs<endpoint_ extends def.userType.endpoint> = [form: def.gate.provider.request<endpoint_>['form'], ctx: endpointCtx<endpoint_>]

      type endpoint<endpoint_ extends def.userType.endpoint> = (...endpointArgs: endpointArgs<endpoint_>) => Promise<endpoint_[1]>
    }
  }
}
