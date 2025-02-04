/* eslint-disable @typescript-eslint/no-invalid-void-type */

declare module 'moodle-domain' {
  type UserAccess = {
    [personaType in keyof Personas]?: Personas[personaType] extends Persona
      ? UserAccess_Personas<Personas[personaType]>
      : never
  }

  type UserAccess_Personas<persona extends Persona> = {
    [contextName in keyof persona]?: persona[contextName] extends Context ? UserAccess_Context<persona[contextName]> : never
  } & { _: persona[typeof _dir] }

  type UserAccess_Context<context extends Context> = {
    [scopeName in keyof context]?: context[scopeName] extends Scope ? UserAccess_Scope<context[scopeName]> : never
  } & { _: context[typeof _dir] }

  type UserAccess_Scope<scope extends Scope> = {
    [useCaseName in keyof scope]?: scope[useCaseName] extends UseCase ? UserAccess_UseCase<scope[useCaseName]> : never
  } & { _: scope[typeof _dir] }

  type UserAccess_UseCase<useCase extends UseCase> = {
    [endpointName in keyof useCase]?: { _: useCase[endpointName][2] }
  } & { _: useCase[typeof _dir] }
}
