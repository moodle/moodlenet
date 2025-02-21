/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/no-namespace */
import type { any_, map, serializable, serializable_object } from '@moodle/lib-types'
import type { ZodType } from 'zod'
declare global {
  namespace moo {
    type persona<personaDef extends persona.def> = personaDef

    namespace persona {
      type def = /* Partial< */ map<context.def> & withConfigs & withContext // ,moo.contexts>>

      const context: unique symbol
      type withContext = { [context]?: serializable_object }

      type context<contextScopesDef extends context.def> = contextScopesDef
      namespace context {
        type def = Partial<map<scope.def, moo.scopeNames> & withConfigs & withContext>
      }

      type scope<scopeDef extends scope.def> = scopeDef
      namespace scope {
        type def = map<usecase.def> & withConfigs & withContext
      }

      type usecase<usecaseDef extends usecase.def> = usecaseDef
      namespace usecase {
        type def = map<endpoint.def> & withConfigs & withContext
      }

      type endpoint<endpointDef extends endpoint.def> = [
        epZodType<endpointDef[0]>,
        endpointDef[1],
        endpointDef[2],
        endpointDef[3],
      ]
      namespace endpoint {
        type def = [form: zodTypeOrProvider, outcome: any_, configs?: serializable | undefined | void, context?: any_]
      }
    }
  }
}
type zodTypeOrProvider = ZodType | ((...a: any_[]) => ZodType)

type epZodType<T extends zodTypeOrProvider> = T extends ZodType
  ? T
  : T extends (...a: any_[]) => ZodType
    ? ReturnType<T>
    : never
