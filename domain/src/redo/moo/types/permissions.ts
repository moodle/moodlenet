/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import '@moodle/lib-types'

declare global {
  namespace moo {
    type permissions = {
      [personaType in keyof Personas]?: Personas[personaType] extends moo.persona
        ? permissions.persona<Personas[personaType]>
        : never
    }
    namespace permissions {
      type persona<persona extends moo.persona> = persona.dir<persona> & {
        [contextName in persona.keysof<persona>]?: persona[contextName] extends moo.persona.context
          ? permissions.context<persona[contextName]>
          : never
      }

      type context<context extends moo.persona.context> = persona.dir<context> & {
        [scopeName in persona.keysof<context>]?: context[scopeName] extends moo.persona.scope
          ? permissions.scope<context[scopeName]>
          : never
      }

      type scope<scope extends moo.persona.scope> = persona.dir<scope> & {
        [useCaseName in persona.keysof<scope>]?: scope[useCaseName] extends moo.persona.usecase
          ? permissions.UseCase<scope[useCaseName]>
          : never
      }

      type UseCase<useCase extends moo.persona.usecase> = persona.dir<useCase> & {
        [endpointName in persona.keysof<useCase>]?: permissions.Endpoint<persona.endpoint<useCase[endpointName]>>
      }

      type Endpoint<useCaseEndpoint extends moo.persona.endpoint> = { _: useCaseEndpoint[2] }
    }
  }
}
