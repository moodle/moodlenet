/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { any_, map } from '@moodle/lib-types'

declare module 'moodle-domain' {
  type DefPersona<personaDef extends PersonaDef> = personaDef
  type PersonaDef = {
    context: unknown
    services: Partial<PersonaServicesDef>
  }

  type DefServiceAccess<serviceAccessDef extends ServiceAccessDef> = serviceAccessDef

  type ServiceAccessDef = {
    useCase: {
      [useCaseName: string]: UseCaseDef
    }
  }

  type DefPersonaServices<personaServicesDef extends Partial<PersonaServicesDef>> = personaServicesDef /*  & {
    [serviceName in keyof Services]: ServiceAccessDef
  } */

  type PersonaServicesDef = {
    [service_name in keyof Services]: ServiceAccessDef
  }

  type DefUseCase<useCaseDef extends UseCaseDef> = useCaseDef
  type UseCaseDef = {
    [useCaseEndpoint: string]: UseCaseEpDef
  }

  type DefUseCaseEp<useCaseEpDef extends UseCaseEpDef> = useCaseEpDef
  type UseCaseEpDef = [message: any_, outcome: any_, directives?: map]
}
