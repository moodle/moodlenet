/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { unbranded } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { ZodType } from 'zod'
import { error4xx } from '../../../types'

declare module 'moodle-domain' {
  type Gate<provider extends boolean = true> = {
    [personaType in keyof Personas]?: Gate_Contexts<Personas[personaType], provider>
  }

  type Gate_Contexts<persona extends Persona, provider extends boolean = true> = {
    [contextName in keyof persona]?: persona[contextName] extends Context
      ? Gate_Scopes<persona[contextName], provider>
      : unknown
  }

  type Gate_Scopes<context extends Context, provider extends boolean = true> = {
    [scopeName in keyof context]?: context[scopeName] extends Scope ? Gate_UseCases<context[scopeName], provider> : unknown
  }

  type Gate_UseCases<scope extends Scope, provider extends boolean = true> = {
    [useCaseName in keyof scope]?: scope[useCaseName] extends UseCase ? Gate_Endpoints<scope[useCaseName], provider> : never
  }

  type Gate_Endpoints<useCase extends UseCase, provider extends boolean = true> = {
    [endpointName in keyof useCase]?: provider extends false
      ? Gate_Either_Endpoint<useCase[endpointName], false>
      : Gate_Either_Endpoint_Provider<useCase[endpointName], true>
  }

  type Gate_Either_Endpoint_Provider<useCaseEndpoint extends UseCaseEndpoint, provider extends boolean = true> = (_: {
    permissions: Permissions
  }) => Gate_Either_Endpoint<useCaseEndpoint, provider>

  type Gate_Either_Endpoint<useCaseEndpoint extends UseCaseEndpoint, provider extends boolean = true> = Either<
    error4xx,
    Gate_Endpoint<useCaseEndpoint, provider>
  >

  type Gate_Endpoint<useCaseEndpoint extends UseCaseEndpoint, provider extends boolean = true> = {
    zod: Gate_Endpoint_Zod<useCaseEndpoint>
  } & (provider extends false ? { call: Gate_Endpoint_Call<useCaseEndpoint> } : unknown)

  type Gate_Endpoint_Zod<useCaseEndpoint extends UseCaseEndpoint> = ZodType<unbranded<useCaseEndpoint[0]>>

  type Gate_Endpoint_Call<useCaseEndpoint extends UseCaseEndpoint> = (
    message: useCaseEndpoint[0],
  ) => Promise<useCaseEndpoint[1]>

}
