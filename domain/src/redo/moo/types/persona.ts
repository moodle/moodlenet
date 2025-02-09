/* eslint-disable @typescript-eslint/no-namespace */
import type { any_, map, serializable, serializable_object } from '@moodle/lib-types'
import type { ZodType } from 'zod'
declare global {
  namespace moo {
    type persona<personaDef extends PersonaDef> = personaDef

    namespace persona {
      type withDirectives = { [moo.persona.directives]?: serializable_object }
      const directives: unique symbol
      namespace usecase {
        type withServices = { [moo.persona.usecase.services]?: Partial<map<map<serializable_object>, moo.services>> }
        const services: unique symbol
      }

      type context<contextScopesDef extends ContextDef = ContextDef> = contextScopesDef

      type scope<scopeUseCasesDef extends ScopeDef = ScopeDef> = scopeUseCasesDef

      type usecase<useCaseEndpointsDef extends UseCaseDef = UseCaseDef> = useCaseEndpointsDef

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

type PersonaDef = /* Partial< */ map<ContextDef & moo.persona.withDirectives> // ,moo.contexts>>
type ContextDef = /* Partial< */ map<ScopeDef & moo.persona.withDirectives> // ,moo.scopes>>
type ScopeDef = map<UseCaseDef & moo.persona.withDirectives>
type UseCaseDef = map<EndpointDef & moo.persona.withDirectives & moo.persona.usecase.withServices>

type EndpointDef = [message: zodTypeOrProvider, outcome: any_, directives: serializable | undefined]





