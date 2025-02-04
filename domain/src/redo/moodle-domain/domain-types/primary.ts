/* eslint-disable @typescript-eslint/no-invalid-void-type */


declare module 'moodle-domain' {
  type Primary = {
    [personaType in keyof Personas]: Primary_Personas<Personas[personaType]>
  }

  type Primary_Personas<persona extends Persona> = {
    [scopeName in keyof persona]: persona[scopeName] extends Scope ? Primary_Scope<persona[scopeName]> : never
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
