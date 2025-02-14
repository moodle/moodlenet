/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/no-namespace */
import type { any_, map, serializable, serializable_object } from '@moodle/lib-types'
import type { ZodType } from 'zod'
declare global {
  namespace moo {
    type persona<personaDef extends persona.def> = personaDef

    namespace persona {
      type def = /* Partial< */ map<context.def> & withConfigs & withMeta // ,moo.contexts>>

      const meta: unique symbol
      type withMeta = { [meta]?: serializable_object }

      type context<contextScopesDef extends context.def> = contextScopesDef
      namespace context {
        type def = Partial<map<scope.def, moo.scopeNames> & withConfigs>
      }

      type scope<scopeDef extends scope.def> = scopeDef
      namespace scope {
        type def = map<usecase.def> & withConfigs
      }

      type usecase<
        usecaseDef extends usecase.def,
        modelTypesDef extends usecase.modelTypes.def = usecase.modelTypes.def,
      > = usecaseDef & (modelTypesDef extends never ? unknown : { [usecase.modelTypes]: modelTypesDef })
      namespace usecase {
        type def = map<endpoint.def> & withConfigs
        namespace modelTypes {
          type def = { [n in moo.modelName]?: map<serializable_object> }
        }
        const modelTypes: unique symbol
      }

      type endpoint<endpointDef extends endpoint.def> = [
        epZodType<endpointDef[0]>,
        endpointDef[1],
        endpointDef[2],
        endpointDef[3],
      ]
      namespace endpoint {
        type def = [message: zodTypeOrProvider, outcome: any_, configs: serializable | undefined | void, more?: any_]
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
