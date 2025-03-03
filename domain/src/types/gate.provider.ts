/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { any_, map, serializable_object, signed_token, url_string } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { Error4xx } from '../lib/access-error'

declare global {
  namespace moo {
    namespace gate {
      type provider<forPersonas extends map<moo.persona<any_>>> = {
        [personaType_ in keyof forPersonas]: provider.persona<forPersonas[personaType_]>
      }
      namespace provider {
        type serverClaims = { authSessionToken: signed_token | null; requestId: string; href: url_string; ua: string | null; meta?: serializable_object }
        type request<endpoint_ extends persona.endpoint<any_>> = client.request<endpoint_> & {
          claims: {
            // client: clientClaims
            server: serverClaims
          }
        }
        type persona<persona_ extends moo.persona<any_>> = {
          [contextName in string & keyof persona_]: persona_[contextName] extends moo.persona.context<any_> ? context<persona_[contextName]> : unknown
        }

        type context<context extends moo.persona.context<any_>> = {
          [scopeName in string & keyof context]: context[scopeName] extends moo.persona.scope<any_> ? scope<context[scopeName]> : unknown
        }

        type scope<scope extends moo.persona.scope<any_>> = {
          [useCaseName in string & keyof scope]: scope[useCaseName] extends moo.persona.usecase<any_> ? usecase<scope[useCaseName]> : never
        }

        type usecase<useCase extends moo.persona.usecase<any_>> = {
          [endpointName in string & keyof useCase]: useCase[endpointName] extends moo.persona.endpoint<any_> ? endpoint<useCase[endpointName]> : never
        }

        type endpoint<useCaseEndpoint extends moo.persona.endpoint<any_>> = (epGateCtx: {
          configs: useCaseEndpoint[2]
          sessionInfo: session.user.info
        }) => Either<Error4xx, endpointChecksHandle<useCaseEndpoint>>
      }
    }
  }
}
