/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { any_, any_other_string, map } from '@moodle/lib-types'

declare module 'moodle-domain' {
  type PersonaDef = {
    scope: PersonaScopesDef
    context: map | never
  }

  type DefPersona<personaDef extends PersonaDef> = personaDef

  type DefScope<scopeDef extends ScopeDef> = scopeDef

  type ScopeDef = {
    useCase: map<UseCaseDef>
    // claims: map | never
  }

  type DefPersonaScopes<personaScopesDef extends PersonaScopesDef> = personaScopesDef

  type PersonaScopesDef = Partial<map<ScopeDef, scopes | any_other_string>>

  // type PersonaScopesDef = Partial<{
  //   [scopeName in keyof UserScopes]: ScopeDef
  // }>

  type DefUseCase<useCaseDef extends UseCaseDef> = useCaseDef
  type UseCaseDef = {
    // configs: map | never
    endpoint: map<UseCaseEpDef>
  }

  type DefUseCaseEp<useCaseEpDef extends UseCaseEpDef> = useCaseEpDef
  type UseCaseEpDef = [message: any_, outcome: any_, directives?: map]
}
