/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { any_ } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { ZodType } from 'zod'
import { error4xx } from '../lib/access-error'

declare global {
  namespace moo {
    type gate<provider extends boolean> = {
      [personaType in keyof Personas]: gate.persona<Personas[personaType], provider>
    }
    namespace gate {
      type provider = gate<true>
      type user = gate<false>

      type persona<persona_ extends moo.persona<any_, any_>, provider extends boolean> =
        | {
            [contextName in persona.keysof<persona_>]: persona_[contextName] extends moo.persona.context
              ? context<persona_[contextName], provider>
              : unknown
          }
        | (provider extends false ? undefined : never)

      type context<context extends moo.persona.context, provider extends boolean> =
        | {
            [scopeName in persona.keysof<context>]: context[scopeName] extends moo.persona.scope
              ? scope<context[scopeName], provider>
              : unknown
          }
        | (provider extends false ? undefined : never)

      type scope<scope extends moo.persona.scope, provider extends boolean> =
        | {
            [useCaseName in persona.keysof<scope>]: scope[useCaseName] extends moo.persona.usecase
              ? usecase<scope[useCaseName], provider>
              : never
          }
        | (provider extends false ? undefined : never)

      type usecase<useCase extends moo.persona.usecase, provider extends boolean> =
        | {
            [endpointName in persona.keysof<useCase>]: provider extends false
              ? endpoint<persona.endpoint<useCase[endpointName]>, false>
              : endpointProvider<persona.endpoint<useCase[endpointName]>>
          }
        | (provider extends false ? undefined : never)

      type endpointProvider<useCaseEndpoint extends moo.persona.endpoint> = (_: {
        directives: useCaseEndpoint[2]
        permissions: permissions.user
      }) => Either<error4xx, endpoint<useCaseEndpoint, true>>

      type endpoint<useCaseEndpoint extends moo.persona.endpoint, provider extends boolean> =
        | ({
            zod: endpointZod<useCaseEndpoint>
          } & (provider extends false ? { call: endpointCall<useCaseEndpoint> } : unknown))
        | (provider extends false ? undefined : never)

      type endpointZod<useCaseEndpoint extends moo.persona.endpoint> = useCaseEndpoint[0]

      type endpointCall<useCaseEndpoint extends moo.persona.endpoint> = (
        message: useCaseEndpoint[0] extends ZodType<any_, any_, infer inputType> ? inputType : never,
      ) => Promise<useCaseEndpoint[1]>

      type messageDispatcher<more = unknown> = (message: { path: string[]; payload: unknown } & more) => Promise<unknown>
    }
  }
}
