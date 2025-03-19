/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { any_, map, signed_token, url_string } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { Error4xx } from '../lib/access-error'

declare global {
  namespace moo.def.gate {
    type provider<forUserTypes extends map<moo.def.userType<any_>> = UserTypes> = {
      [userType_ in keyof forUserTypes]: provider.userType<forUserTypes[userType_]>
    }
    namespace provider {
      type dispatcher = (gateProviderRequest: request) => Promise<unknown>
      type requestClaims = {
        server: { authSessionToken: signed_token | null; requestId: string; href: url_string; ua: string | null; meta?: unknown }
      }
      type request<endpoint_ extends def.userType.endpoint<any_> = def.userType.endpoint<any_>> = client.request<endpoint_> & {
        info: {
          claims: requestClaims
        }
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

      type endpoint<useCaseEndpoint extends moo.def.userType.endpoint<any_> = moo.def.userType.endpoint<any_>> = (epGateCtx: {
        configs: useCaseEndpoint[2]
        policiesInfo: def.policies.user.info
      }) => Either<Error4xx, endpointChecksHandle<useCaseEndpoint>>
    }
  }
}
