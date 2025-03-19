/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { any_, map, path } from '@moodle/lib-types'
import { ZodType } from 'zod'
import { Error4xx } from '../lib/access-error'
import { Either } from 'fp-ts/Either'

declare global {
  namespace moo.def.gate {
    // type clientClaims = { locale?: string; locales?: string[] }

    type gateContextChecks<useCaseEndpoint extends moo.def.userType.endpoint<any_>> = useCaseEndpoint[3] extends never | undefined | null | void
      ? {
          context?: undefined
        }
      : {
          context: {
            preflight: preflight<useCaseEndpoint>
            check: contextCheck<useCaseEndpoint>
          }
        }

    type endpointChecksHandle<useCaseEndpoint extends moo.def.userType.endpoint<any_>> = {
      zod: endpointZod<useCaseEndpoint>
    } & gateContextChecks<useCaseEndpoint>

    type contextCheck<useCaseEndpoint extends moo.def.userType.endpoint<any_>> = (_: { context: useCaseEndpoint[3] }) => Either<Error4xx, unknown>

    type preflight<useCaseEndpoint extends moo.def.userType.endpoint<any_>> = (_: {
      context: useCaseEndpoint[3]
      form: def.userType.endpointFormType<useCaseEndpoint>
    }) => Either<Error4xx, unknown>

    type endpointZod<useCaseEndpoint extends moo.def.userType.endpoint<any_>> = useCaseEndpoint[0]

    type client<forUserTypes extends map<moo.def.userType<any_>> = UserTypes> = {
      [userType_ in keyof forUserTypes]: client.userType<forUserTypes[userType_]>
    }
    namespace client {
      type request<endpoint_ extends def.userType.endpoint<any_> = def.userType.endpoint<any_>> = {
        path: path
        form: endpoint_[0] extends ZodType<infer ouputType, any_, any_> ? ouputType : never
      }
      type dispatcher = (gateClientRequest: request) => Promise<unknown>

      type userType<userType_ extends moo.def.userType<any_>> = {
        [contextName in string & keyof userType_]: userType_[contextName] extends moo.def.userType.context<any_> ? context<userType_[contextName]> : unknown
      } & withAccErr<'u'>

      type context<context extends moo.def.userType.context<any_>> = {
        [scopeName in string & keyof context]: context[scopeName] extends moo.def.userType.scope<any_> ? scope<context[scopeName]> : unknown
      } & withAccErr<'u'>

      type scope<scope extends moo.def.userType.scope<any_>> = {
        [useCaseName in string & keyof scope]: scope[useCaseName] extends moo.def.userType.usecase<any_> ? usecase<scope[useCaseName]> : never
      } & withAccErr<'u'>

      type usecase<useCase extends moo.def.userType.usecase<any_>> = {
        [endpointName in string & keyof useCase]: useCase[endpointName] extends moo.def.userType.endpoint<any_> ? endpointAccess<useCase[endpointName]> : never
      } & withAccErr<'u'>

      type endpointAccessHandle<useCaseEndpoint extends moo.def.userType.endpoint<any_> = moo.def.userType.endpoint<any_>> = endpointChecksHandle<useCaseEndpoint> &
        withAccErr<'u'> & {
          allowed: true
          send: endpointCall<useCaseEndpoint>
        }

      type endpointAccess<useCaseEndpoint extends moo.def.userType.endpoint<any_> = moo.def.userType.endpoint<any_>> = withAccErr &
        ((
          context: useCaseEndpoint[3] extends never | undefined | null | void ? void : useCaseEndpoint[3],
        ) => (withAccErr<'e'> & { allowed: false; zod?: undefined; send?: endpointCall<useCaseEndpoint>; context?: undefined }) | endpointAccessHandle<useCaseEndpoint>)

      type withAccErr<t extends 'e' | 'u' = 'e' | 'u'> = {
        _: t extends 'e' ? { error: Error4xx } : never | t extends 'u' ? undefined : never
      }

      type endpointCall<useCaseEndpoint extends moo.def.userType.endpoint<any_> = moo.def.userType.endpoint<any_>> = (
        form: useCaseEndpoint[0] extends ZodType<any_, any_, infer inputType> ? inputType : never,
      ) => Promise<useCaseEndpoint[1]>
    }
  }
}
