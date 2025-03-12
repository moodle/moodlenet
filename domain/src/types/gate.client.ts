/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { any_, map, path } from '@moodle/lib-types'
import { ZodType } from 'zod'
import { Error4xx } from '../lib/access-error'

declare global {
  namespace moo {
    namespace gate {
      // type clientClaims = { locale?: string; locales?: string[] }

      type gateContextChecks<useCaseEndpoint extends moo.persona.endpoint<any_>> = useCaseEndpoint[3] extends never | undefined | null | void
        ? {
            context?: undefined
          }
        : {
            context: {
              preflight: preflight<useCaseEndpoint>
              check: contextCheck<useCaseEndpoint>
            }
          }

      type endpointChecksHandle<useCaseEndpoint extends moo.persona.endpoint<any_>> = {
        zod: endpointZod<useCaseEndpoint>
      } & gateContextChecks<useCaseEndpoint>

      type contextCheck<useCaseEndpoint extends moo.persona.endpoint<any_>> = (_: { context: useCaseEndpoint[3] }) => Error4xx | undefined

      type preflight<useCaseEndpoint extends moo.persona.endpoint<any_>> = (_: {
        context: useCaseEndpoint[3]
        form: persona.endpointFormType<useCaseEndpoint>
      }) => Error4xx | undefined

      type endpointZod<useCaseEndpoint extends moo.persona.endpoint<any_>> = useCaseEndpoint[0]

      type client<forPersonas extends map<moo.persona<any_>>> = {
        [personaType_ in keyof forPersonas]: client.persona<forPersonas[personaType_]>
      }
      namespace client {
        type request<endpoint_ extends persona.endpoint<any_> = persona.endpoint<any_>> = {
          path: path
          form: endpoint_[0] extends ZodType<infer ouputType, any_, any_> ? ouputType : never
        }
        type dispatcher = (gateClientRequest: request) => Promise<unknown>

        type persona<persona_ extends moo.persona<any_>> = {
          [contextName in string & keyof persona_]: persona_[contextName] extends moo.persona.context<any_> ? context<persona_[contextName]> : unknown
        } & withAccErr<'u'>

        type context<context extends moo.persona.context<any_>> = {
          [scopeName in string & keyof context]: context[scopeName] extends moo.persona.scope<any_> ? scope<context[scopeName]> : unknown
        } & withAccErr<'u'>

        type scope<scope extends moo.persona.scope<any_>> = {
          [useCaseName in string & keyof scope]: scope[useCaseName] extends moo.persona.usecase<any_> ? usecase<scope[useCaseName]> : never
        } & withAccErr<'u'>

        type usecase<useCase extends moo.persona.usecase<any_>> = {
          [endpointName in string & keyof useCase]: useCase[endpointName] extends moo.persona.endpoint<any_> ? endpointAccess<useCase[endpointName]> : never
        } & withAccErr<'u'>

        type endpointAccessHandle<useCaseEndpoint extends moo.persona.endpoint<any_> = moo.persona.endpoint<any_>> = endpointChecksHandle<useCaseEndpoint> &
          withAccErr<'u'> & {
            allowed: true
            send: endpointCall<useCaseEndpoint>
          }

        type endpointAccess<useCaseEndpoint extends moo.persona.endpoint<any_> = moo.persona.endpoint<any_>> = withAccErr &
          ((
            context: useCaseEndpoint[3] extends never | undefined | null | void ? void : useCaseEndpoint[3],
          ) => (withAccErr<'e'> & { allowed: false; zod?: undefined; send?: endpointCall<useCaseEndpoint>; context?: undefined }) | endpointAccessHandle<useCaseEndpoint>)

        type withAccErr<t extends 'e' | 'u' = 'e' | 'u'> = {
          _: t extends 'e' ? { error: Error4xx } : never | t extends 'u' ? undefined : never
        }

        type endpointCall<useCaseEndpoint extends moo.persona.endpoint<any_> = moo.persona.endpoint<any_>> = (
          form: useCaseEndpoint[0] extends ZodType<any_, any_, infer inputType> ? inputType : never,
        ) => Promise<useCaseEndpoint[1]>
      }
    }
  }
}
