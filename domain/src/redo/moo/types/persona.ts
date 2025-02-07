/* eslint-disable @typescript-eslint/no-namespace */
import type { any_, map, serializable, serializable_object } from '@moodle/lib-types'
import type { ZodType } from 'zod'

declare global {
  namespace moo {
    type persona<personaDef extends PersonaDef, directives extends serializable_object = never> = dir_sym_tag<directives> &
      personaDef

    namespace persona {
      type dirProp = typeof directivesSym

      type dirType<T> = T extends { [directivesSym]?: never }
        ? never
        : T extends { [directivesSym]: infer dir }
          ? dir
          : never

      type keysof<T> = Exclude<keyof T, dirProp>

      type context<
        contextScopesDef extends ContextDef = ContextDef,
        directives extends serializable_object | undefined = undefined,
      > = dir_sym_tag<directives> & contextScopesDef

      type scope<
        scopeUseCasesDef extends ScopeDef = ScopeDef,
        directives extends serializable_object | undefined = undefined,
      > = dir_sym_tag<directives> & scopeUseCasesDef

      type usecase<
        useCaseEndpointsDef extends UseCaseDef = UseCaseDef,
        directives extends serializable_object | undefined = undefined,
      > = dir_sym_tag<directives> & useCaseEndpointsDef

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

type dir_sym_tag<directives> = { [directivesSym]: directives }

declare const directivesSym: unique symbol
