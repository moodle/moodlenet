/* eslint-disable @typescript-eslint/no-invalid-void-type */

declare module 'moodle-domain' {
  type Permissions = {
    [personaType in keyof Personas]?: Personas[personaType] extends Persona
      ? Permissions_Personas<Personas[personaType]>
      : never
  }

  type Permissions_Personas<persona extends Persona> = {
    [contextName in keyof persona]?: persona[contextName] extends Context ? Permissions_Context<persona[contextName]> : never
  } & m_dir<persona[typeof _dir]>

  type Permissions_Context<context extends Context> = {
    [scopeName in keyof context]?: context[scopeName] extends Scope ? Permissions_Scope<context[scopeName]> : never
  } & m_dir<context[typeof _dir]>

  type Permissions_Scope<scope extends Scope> = {
    [useCaseName in keyof scope]?: scope[useCaseName] extends UseCase ? Permissions_UseCase<scope[useCaseName]> : never
  } & m_dir<scope[typeof _dir]>

  type Permissions_UseCase<useCase extends UseCase> = {
    [endpointName in keyof useCase]?: Permissions_Endpoint<useCase[endpointName]>
  } & m_dir<useCase[typeof _dir]>

  type Permissions_Endpoint<useCaseEndpoint extends UseCaseEndpoint> = m_dir<useCaseEndpoint[2]>
}
type m_dir<dir_val> = dir_val extends undefined
  ? NonNullable<object>
  : {
      _: dir_val
    }
