/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { any_ } from '@moodle/lib-types'

declare module 'moodle-domain' {
  type DefPersona<personaDef extends PersonaDef> = personaDef
  type PersonaDef = {
    context: unknown
    systems: Partial<PersonaSystemsDef>
  }

  type DefSystemAccess<systemAccessDef extends SystemAccessDef> = systemAccessDef

  type SystemAccessDef = {
    useCase: {
      [useCaseName: string]: UseCaseDef
    }
  }

  type DefPersonaSystems<personaSystemsDef extends Partial<PersonaSystemsDef>> = personaSystemsDef /*  & {
    [systemName in keyof Systems]: SystemAccessDef
  } */

  type PersonaSystemsDef = {
    [system_name in keyof Systems]: SystemAccessDef
  }

  type UseCaseDef = {
    [useCaseEndpoint: string]: UseCaseEpDef
  }

  type UseCaseEpDef = [message: any_, outcome: any_, directives?: any_]

  type DefUseCase<useCaseDef extends UseCaseDef> = useCaseDef
}
