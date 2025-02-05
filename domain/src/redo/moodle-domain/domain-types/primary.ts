/* eslint-disable @typescript-eslint/no-invalid-void-type */


declare module 'moodle-domain' {
  type Primary = {
    [personaType in keyof Personas]: Primary_Personas<Personas[personaType]>
  }

  type Primary_Personas<persona extends Persona> = {
    [contextName in keyof persona]: persona[contextName] extends Context ? Primary_Context<persona[contextName]> : never
  }

  type Primary_Context<context extends Context> = {
    [scopeName in keyof context]: context[scopeName] extends Scope ? Primary_Scope<context[scopeName]> : never
  }

  type Primary_Scope<scope extends Scope> = {
    [useCaseName in keyof scope]: scope[useCaseName] extends UseCase ? Primary_UseCase<scope[useCaseName]> : never
  }

  type Primary_UseCase<useCase extends UseCase> = {
    [endpointName in keyof useCase]: useCase[endpointName] extends UseCaseEndpoint
      ? Primary_UseCaseEndpoint<useCase[endpointName]>
      : never
  }

  type Primary_UseCaseEndpoint<useCaseEndpoint extends UseCaseEndpoint> = (
    message: useCaseEndpoint[0],
  ) => Promise<useCaseEndpoint[1]>

}
