/* eslint-disable @typescript-eslint/no-invalid-void-type */

declare module 'moodle-domain' {
  type Permissions = {
    [personaType in keyof Personas]?: Personas[personaType] extends Persona
      ? Permissions_Personas<Personas[personaType]>
      : never
  }

  type Permissions_Personas<persona extends Persona> = {
    [contextName in keyof persona]?: persona[contextName] extends Context ? Permissions_Context<persona[contextName]> : never
  } & { _: persona[typeof _dir] }

  type Permissions_Context<context extends Context> = {
    [scopeName in keyof context]?: context[scopeName] extends Scope ? Permissions_Scope<context[scopeName]> : never
  } & { _: context[typeof _dir] }

  type Permissions_Scope<scope extends Scope> = {
    [useCaseName in keyof scope]?: scope[useCaseName] extends UseCase ? Permissions_UseCase<scope[useCaseName]> : never
  } & { _: scope[typeof _dir] }

  type Permissions_UseCase<useCase extends UseCase> = {
    [endpointName in keyof useCase]?: { _: useCase[endpointName][2] }
  } & { _: useCase[typeof _dir] }
}
