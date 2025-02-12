/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { any_ } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { ZodType } from 'zod'
import { error4xx } from '../lib/access-error'

type Gate<proxy extends boolean> = {
  [personaType_ in moo.personaType]: moo.gate.persona<moo.Personas[personaType_], proxy>
}

declare global {
  namespace moo {
    namespace gate {
      type provider = Gate<false>
      type proxy = Gate<true>

      type persona<persona_ extends moo.persona<any_>, proxy extends boolean = false> =
        | {
            [contextName in string & keyof persona_]: persona_[contextName] extends moo.persona.context<any_>
              ? context<persona_[contextName], proxy>
              : unknown
          }
        | (proxy extends true ? undefined : never)

      type context<context extends moo.persona.context<any_>, proxy extends boolean = false> =
        | {
            [scopeName in string & keyof context]: context[scopeName] extends moo.persona.scope<any_>
              ? scope<context[scopeName], proxy>
              : unknown
          }
        | (proxy extends true ? undefined : never)

      type scope<scope extends moo.persona.scope<any_>, proxy extends boolean = false> =
        | {
            [useCaseName in string & keyof scope]: scope[useCaseName] extends moo.persona.usecase<any_>
              ? usecase<scope[useCaseName], proxy>
              : never
          }
        | (proxy extends true ? undefined : never)

      type usecase<useCase extends moo.persona.usecase<any_>, proxy extends boolean = false> =
        | {
            [endpointName in string & keyof useCase]: useCase[endpointName] extends moo.persona.endpoint<any_>
              ? proxy extends true
                ? endpointAcccess<useCase[endpointName], proxy>
                : endpoint<useCase[endpointName], proxy>
              : never
          }
        | (proxy extends true ? undefined : never)

      type endpoint<useCaseEndpoint extends moo.persona.endpoint<any_>, proxy extends boolean = false> = (epGateCtx: {
        configs: useCaseEndpoint[2]
        session: session.user
      }) => Either<error4xx, endpointAcccess<useCaseEndpoint, proxy>>

      type endpointAcccess<useCaseEndpoint extends moo.persona.endpoint<any_>, proxy extends boolean = false> =
        | ({
            zod: endpointZod<useCaseEndpoint>
          } & (proxy extends false ? unknown : { call: endpointCall<useCaseEndpoint> }))
        | (proxy extends true ? undefined : never)

      type endpointZod<useCaseEndpoint extends moo.persona.endpoint<any_>> = useCaseEndpoint[0]

      type endpointCall<useCaseEndpoint extends moo.persona.endpoint<any_>> = (
        message: useCaseEndpoint[0] extends ZodType<any_, any_, infer inputType> ? inputType : never,
      ) => Promise<useCaseEndpoint[1]>

      type messageDispatcher<more = unknown> = (message: { path: string[]; payload: unknown } & more) => Promise<unknown>
    }
  }
}
