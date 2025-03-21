/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { map } from '@moodle/lib-types'

declare global {
  namespace moo.def.gate.client {
    type proxy<forUserTypes extends map<moo.def.userType> = moo<UserType>> = {
      [userType_ in keyof forUserTypes]: proxy.userType<forUserTypes[userType_]>
    }
    namespace proxy {
      type dispatcher = (gateProviderRequest: provider.request) => Promise<unknown>

      type userType<userType_ extends moo.def.userType> = {
        [contextName in string & keyof userType_]: userType_[contextName] extends moo.def.userType.model ? context<userType_[contextName]> : unknown
      }

      type context<context extends moo.def.userType.model> = {
        [scopeName in string & keyof context]: context[scopeName] extends moo.def.userType.scope ? scope<context[scopeName]> : unknown
      }

      type scope<scope extends moo.def.userType.scope> = {
        [useCaseName in string & keyof scope]: scope[useCaseName] extends moo.def.userType.usecase ? usecase<scope[useCaseName]> : never
      }

      type usecase<useCase extends moo.def.userType.usecase> = {
        [endpointName in string & keyof useCase]: useCase[endpointName] extends moo.def.userType.endpoint ? endpoint<useCase[endpointName]> : never
      }

      type endpoint<useCaseEndpoint extends moo.def.userType.endpoint = moo.def.userType.endpoint> = (
        form: def.userType.endpointFormType<useCaseEndpoint>,
      ) => Promise<useCaseEndpoint[1]>
    }
  }
}
