/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { any_, map } from '@moodle/lib-types'

declare global {
  namespace moo.def.gate.client {
    type proxy<forUserTypes extends map<moo.def.userType<any_>> = UserTypes> = {
      [userType_ in keyof forUserTypes]: proxy.userType<forUserTypes[userType_]>
    }
    namespace proxy {
      type dispatcher = (gateProviderRequest: provider.request) => Promise<unknown>

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

      type endpoint<useCaseEndpoint extends moo.def.userType.endpoint<any_> = moo.def.userType.endpoint<any_>> = (
        form: def.userType.endpointFormType<useCaseEndpoint>,
      ) => Promise<useCaseEndpoint[1]>
    }
  }
}
