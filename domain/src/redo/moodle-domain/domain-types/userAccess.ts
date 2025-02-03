/* eslint-disable @typescript-eslint/no-invalid-void-type */

declare module 'moodle-domain' {
  type PersonaAccess<config extends boolean = false> = {
    [personaType in keyof Personas]: Personas[personaType] extends PersonaDef
      ?
          | {
              scope: PersonaAccess_Personas<Personas[personaType], config>
              directives: Personas[personaType]['directives']
            }
          | (config extends true ? never : undefined)
      : never
  }

  type PersonaAccess_Personas<personaDef extends PersonaDef, configs extends boolean = false> = {
    [scopeName in keyof personaDef['scope']]: personaDef['scope'][scopeName] extends ScopeDef
      ?
          | {
              directives: personaDef['scope'][scopeName]['directives']
              useCase: PersonaAccess_Scope<personaDef['scope'][scopeName], configs>
            }
          | (configs extends true ? never : undefined)
      : never
  }

  type PersonaAccess_Scope<scopeDef extends ScopeDef, configs extends boolean = false> = {
    [useCaseName in keyof scopeDef['useCase']]: scopeDef['useCase'][useCaseName] extends UseCaseDef
      ?
          | {
              directives: scopeDef['useCase'][useCaseName]['directives']
            }
          | (configs extends true ? never : undefined)
      : never
  }
}
