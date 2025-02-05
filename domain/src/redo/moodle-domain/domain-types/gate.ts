/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { unbranded } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { ZodType } from 'zod'
import { error4xx } from '../../../types'

declare module 'moodle-domain' {
  type Gate = {
    [personaType in keyof Personas]?: Gate_Contexts<Personas[personaType]>
  }

  type Gate_Contexts<persona extends Persona> = {
    [contextName in keyof persona]: persona[contextName] extends Context ? Gate_Scopes<persona[contextName]> : unknown
  }

  type Gate_Scopes<context extends Context> = {
    [scopeName in keyof context]: context[scopeName] extends Scope ? Gate_UseCases<context[scopeName]> : unknown
  }

  type Gate_UseCases<scope extends Scope> = {
    [useCaseName in keyof scope]: scope[useCaseName] extends UseCase ? Gate_Endpoints<scope[useCaseName]> : never
  }

  type Gate_Endpoints<useCase extends UseCase> = {
    [endpointName in keyof useCase]: Gate_Either_Endpoint_Provider<useCase[endpointName]>
  }

  type Gate_Either_Endpoint_Provider<useCaseEndpoint extends UseCaseEndpoint> = (_: {
    permissions: Permissions
  }) => Gate_Either_Endpoint<useCaseEndpoint>

  type Gate_Either_Endpoint<useCaseEndpoint extends UseCaseEndpoint> = Either<error4xx, Gate_Endpoint<useCaseEndpoint>>

  type Gate_Endpoint<useCaseEndpoint extends UseCaseEndpoint> = {
    // call: Gate_Endpoint_Fn<useCaseEndpoint>
    // zod: Gate_Endpoint_Zod<useCaseEndpoint>
    zod: ZodType<unbranded<useCaseEndpoint[0]>>
  }

  // type Gate_Endpoint_Zod<ucEp extends UseCaseEndpoint> = ZodType<unbranded<ucEp[0]>>

  // type Gate_Endpoint_Fn<ucEp extends UseCaseEndpoint> = (message: ucEp[0]) => Promise<ucEp[1]>
}
