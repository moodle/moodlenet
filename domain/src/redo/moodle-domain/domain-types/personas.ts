import type { any_, map, serializable } from '@moodle/lib-types'
import { ZodType } from 'zod'

declare module 'moodle-domain' {
  type dirDef = serializable | undefined
  const _dir: unique symbol
  type withDir<T, dir extends dirDef> = { [_dir]: dir } & T
  type noDir<T> = Omit<T, typeof _dir>

  type DefPersona<personaContextsDef extends PersonaContextsDef, dir extends dirDef = undefined> = withDir<
    personaContextsDef,
    dir
  >
  type Persona = withDir<PersonaContextsDef, dirDef>
  type PersonaContextsDef = Partial<map<ContextScopesDef, contexts>>

  type DefContext<contextScopesDef extends ContextScopesDef, dir extends dirDef = undefined> = withDir<contextScopesDef, dir>
  type Context = withDir<ContextScopesDef, dirDef>
  type ContextScopesDef = Partial<map<ScopeUseCasesDef, scopes>>

  type DefScope<scopeUseCasesDef extends ScopeUseCasesDef, dir extends dirDef = undefined> = withDir<scopeUseCasesDef, dir>
  type ScopeUseCasesDef = map<UseCaseEndpointsDef>
  type Scope = withDir<ScopeUseCasesDef, dirDef>

  type DefUseCase<useCaseEndpointsDef extends UseCaseEndpointsDef, dir extends dirDef = undefined> = withDir<
    useCaseEndpointsDef,
    dir
  >
  type UseCaseEndpointsDef = map<UseCaseEndpoint>
  type UseCase = withDir<UseCaseEndpointsDef, dirDef>

  type DefUseCaseEndpoint<useCaseEndpoint extends UseCaseEndpoint> = useCaseEndpoint
  type UseCaseEndpoint = [message: ZodType, outcome: any_, directives: serializable | undefined]

  type ucpl<T extends ZodType | ((...a: any_[]) => ZodType)> = T extends ZodType
    ? T
    : T extends (...a: any_[]) => ZodType
      ? ReturnType<T>
      : never
}
