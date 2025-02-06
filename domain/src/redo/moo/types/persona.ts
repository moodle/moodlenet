/* eslint-disable @typescript-eslint/no-namespace */
import type { any_, map, serializable, serializable_object } from '@moodle/lib-types'
import type { ZodType } from 'zod'

declare global {
  namespace moo {
    type persona<personaDef extends PersonaDef = PersonaDef, _ extends serializable_object | undefined = any_> = withDir<
      personaDef,
      _
    >

    namespace persona {
      type dir<T> = { _: T extends withDir<unknown, any_> ? T[typeof _] : undefined }

      type keysof<T> = Exclude<keyof T, _>

      type _ = typeof _

      type context<
        contextScopesDef extends ContextDef = ContextDef,
        _ extends serializable_object | undefined = any_,
      > = withDir<contextScopesDef, _>

      type scope<scopeUseCasesDef extends ScopeDef = ScopeDef, _ extends serializable_object | undefined = any_> = withDir<
        scopeUseCasesDef,
        _
      >

      type usecase<
        useCaseEndpointsDef extends UseCaseDef = UseCaseDef,
        _ extends serializable_object | undefined = any_,
      > = withDir<useCaseEndpointsDef, _>

      type endpoint<useCaseEndpoint extends EndpointDef = EndpointDef> = [
        epType<useCaseEndpoint[0]>,
        useCaseEndpoint[1],
        useCaseEndpoint[2],
      ]
    }
  }
}
type zodTypeOrProvider = ZodType | ((...a: any_[]) => ZodType)

type epType<T extends zodTypeOrProvider> = T extends ZodType
  ? T
  : T extends (...a: any_[]) => ZodType
    ? ReturnType<T>
    : never

type ContextDef = Partial<map<moo.persona.scope>> //, moo.scopes>>
type PersonaDef = Partial<map<moo.persona.context>> //, moo.contexts>>
type ScopeDef = map<UseCaseDef>

type UseCaseDef = map<EndpointDef>
type EndpointDef = [message: zodTypeOrProvider, outcome: any_, directives: serializable | undefined]

type withDir<T, _> = T & { [_]: _ }
declare const _: unique symbol
