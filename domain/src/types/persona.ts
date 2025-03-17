/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/no-namespace */
import type { any_, map } from '@moodle/lib-types'
import type { ZodType } from 'zod'
declare global {
  namespace moo {
    type persona<personaDef extends persona.def> = personaDef

    namespace persona {
      type def = /* Partial< */ map<context.def> & tags<tags.configs> & withContext // ,moo.contexts>>

      const context: unique symbol
      type withContext = { [context]?: unknown }

      type context<contextScopesDef extends context.def> = contextScopesDef
      namespace context {
        type def = Partial<map<scope.def, moo.scopeNames> & tags<tags.configs> & withContext>
      }

      type scope<scopeDef extends scope.def> = scopeDef
      namespace scope {
        type def = map<usecase.def> & tags<tags.configs> & withContext
      }

      type usecase<usecaseDef extends usecase.def> = usecaseDef
      namespace usecase {
        type def = map<endpoint.def> & tags<tags.configs> & withContext
      }

      type endpointFormType<endpoint_ extends endpoint> = endpoint_[0] extends ZodType<any_, any_, infer inputType> ? inputType : never
      type endpoint<endpointDef extends endpoint.def = endpoint.def> = [epZodType<endpointDef[0]>, endpointDef[1], endpointDef[2], endpointDef[3]]
      namespace endpoint {
        type def = [form: zodTypeOrProvider, outcome: any_, configs?: any_, context?: any_]
      }
    }
  }
}

type zodTypeOrProvider<z extends ZodType = ZodType> = z | ((...a: any_[]) => z)
type epZodType<zp> = zp extends zodTypeOrProvider<infer z> ? z : never
