/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { any_ } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { ZodType } from 'zod'
import { error4xx } from '../lib/access-error'

declare global {
  namespace moo {
    type gate<proxy extends boolean> = {
      [personaType_ in personaType]: gate.persona<Personas[personaType_], proxy>
    }
    namespace gate {
      type proxy = gate<false>
      type user = gate<true>

      type persona<persona_ extends moo.persona<any_>, proxy extends boolean = false> =
        | {
            [contextName in string & keyof persona_]: persona_[contextName] extends moo.persona.context
              ? context<persona_[contextName], proxy>
              : unknown
          }
        | (proxy extends false ? undefined : never)

      type context<context extends moo.persona.context, proxy extends boolean = false> =
        | {
            [scopeName in string & keyof context]: context[scopeName] extends moo.persona.scope
              ? scope<context[scopeName], proxy>
              : unknown
          }
        | (proxy extends false ? undefined : never)

      type scope<scope extends moo.persona.scope, proxy extends boolean = false> =
        | {
            [useCaseName in string & keyof scope]: scope[useCaseName] extends moo.persona.usecase
              ? usecase<scope[useCaseName], proxy>
              : never
          }
        | (proxy extends false ? undefined : never)

      type usecase<useCase extends moo.persona.usecase, proxy extends boolean = false> =
        | {
            [endpointName in string & keyof useCase]: proxy extends true
              ? endpointProxy<persona.endpoint<useCase[endpointName]>, false>
              : endpoint<persona.endpoint<useCase[endpointName]>>
          }
        | (proxy extends false ? undefined : never)

      type endpoint<useCaseEndpoint extends moo.persona.endpoint> = (epGateCtx: {
        configs: useCaseEndpoint[2]
        session: session.user
      }) => Either<error4xx, endpointProxy<useCaseEndpoint, true>>

      type endpointProxy<useCaseEndpoint extends moo.persona.endpoint, proxy extends boolean = false> =
        | ({
            zod: endpointZod<useCaseEndpoint>
          } & (proxy extends false ? { call: endpointCall<useCaseEndpoint> } : unknown))
        | (proxy extends false ? undefined : never)

      type endpointZod<useCaseEndpoint extends moo.persona.endpoint> = useCaseEndpoint[0]

      type endpointCall<useCaseEndpoint extends moo.persona.endpoint> = (
        message: useCaseEndpoint[0] extends ZodType<any_, any_, infer inputType> ? inputType : never,
      ) => Promise<useCaseEndpoint[1]>

      type messageDispatcher<more = unknown> = (message: { path: string[]; payload: unknown } & more) => Promise<unknown>
    }
  }
}
