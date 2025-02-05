/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { any_ } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { ZodType } from 'zod'
import { error4xx } from '../../../types'

declare module 'moodle-domain' {
  type Gate<provider extends boolean = true> = {
    [personaType in keyof Personas]: Gate_Persona<Personas[personaType], provider>
  }

  type Gate_Persona<persona extends Persona, provider extends boolean = true> =
    | {
        [contextName in keyof noDir<persona>]: persona[contextName] extends Context
          ? Gate_Context<persona[contextName], provider>
          : unknown
      }
    | (provider extends false ? undefined : never)

  type Gate_Context<context extends Context, provider extends boolean = true> =
    | {
        [scopeName in keyof noDir<context>]: context[scopeName] extends Scope
          ? Gate_Scope<context[scopeName], provider>
          : unknown
      }
    | (provider extends false ? undefined : never)

  type Gate_Scope<scope extends Scope, provider extends boolean = true> =
    | {
        [useCaseName in keyof noDir<scope>]: scope[useCaseName] extends UseCase
          ? Gate_UseCase<scope[useCaseName], provider>
          : never
      }
    | (provider extends false ? undefined : never)

  type Gate_UseCase<useCase extends UseCase, provider extends boolean = true> =
    | {
        [endpointName in keyof noDir<useCase>]: provider extends false
          ? Gate_Endpoint<useCase[endpointName], false>
          : Gate_Endpoint_Provider<useCase[endpointName]>
      }
    | (provider extends false ? undefined : never)

  type Gate_Endpoint_Provider<useCaseEndpoint extends UseCaseEndpoint> = (_: {
    directives: useCaseEndpoint[2]
    permissions: Permissions
  }) => Either<error4xx, Gate_Endpoint<useCaseEndpoint, true>>

  type Gate_Endpoint<useCaseEndpoint extends UseCaseEndpoint, provider extends boolean = true> =
    | ({
        zod: Gate_Endpoint_Zod<useCaseEndpoint>
      } & (provider extends false ? { call: Gate_Endpoint_Call<useCaseEndpoint> } : unknown))
    | (provider extends false ? undefined : never)

  type Gate_Endpoint_Zod<useCaseEndpoint extends UseCaseEndpoint> = useCaseEndpoint[0]

  type Gate_Endpoint_Call<useCaseEndpoint extends UseCaseEndpoint> = (
    message: useCaseEndpoint[0] extends ZodType<any_, any_, infer inputType> ? inputType : never,
  ) => Promise<useCaseEndpoint[1]>
}
