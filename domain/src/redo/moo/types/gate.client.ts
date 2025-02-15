/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { any_, map } from '@moodle/lib-types'
import { ZodType } from 'zod'
import { Error4xx } from '../lib/access-error'

declare global {
  namespace moo {
    namespace gate {
      type client<forPersonas extends map<moo.persona<any_>>> = {
        [personaType_ in keyof forPersonas]: client.persona<forPersonas[personaType_]>
      }
      namespace client {
        type persona<persona_ extends moo.persona<any_>> = {
          [contextName in string & keyof persona_]: persona_[contextName] extends moo.persona.context<any_>
            ? context<persona_[contextName]>
            : unknown
        } & withAccessError

        type context<context extends moo.persona.context<any_>> = {
          [scopeName in string & keyof context]: context[scopeName] extends moo.persona.scope<any_>
            ? scope<context[scopeName]>
            : unknown
        } & withAccessError

        type scope<scope extends moo.persona.scope<any_>> = {
          [useCaseName in string & keyof scope]: scope[useCaseName] extends moo.persona.usecase<any_>
            ? usecase<scope[useCaseName]>
            : never
        } & withAccessError

        type usecase<useCase extends moo.persona.usecase<any_>> = {
          [endpointName in string & keyof useCase]: useCase[endpointName] extends moo.persona.endpoint<any_>
            ? endpointAccess<useCase[endpointName]>
            : never
        } & withAccessError

        type endpointAccessHandle<useCaseEndpoint extends moo.persona.endpoint<any_>> =
          endpointChecksHandle<useCaseEndpoint> &
            withAccessError<'u'> & {
              allowed: true
              send: endpointCall<useCaseEndpoint>
            }

        type endpointAccess<useCaseEndpoint extends moo.persona.endpoint<any_>> = withAccessError &
          ((
            context: useCaseEndpoint[3] extends never | undefined | null | void ? void : useCaseEndpoint[3],
          ) =>
            | (withAccessError<'e'> & { allowed: false; zod?: undefined; send?: undefined; context?: undefined })
            | endpointAccessHandle<useCaseEndpoint>)

        type withAccessError<t extends 'e' | 'u' = 'e' | 'u'> = {
          _: t extends 'e' ? { error: Error4xx } : never | t extends 'u' ? undefined : never
        }

        type endpointCall<useCaseEndpoint extends moo.persona.endpoint<any_>> = (
          form: useCaseEndpoint[0] extends ZodType<any_, any_, infer inputType> ? inputType : never,
        ) => Promise<useCaseEndpoint[1]>
      }
    }
  }
}
