/* eslint-disable @typescript-eslint/no-namespace */
import type { any_, map, serializable, serializable_object } from '@moodle/lib-types'
import type { ZodType } from 'zod'
declare global {
  namespace moo {
    type persona<personaDef extends persona.def> = personaDef

    namespace persona {
      type def = /* Partial< */ map<context.def> & moo.persona.withConfigs & moo.persona.withContext // ,moo.contexts>>

      const configs: unique symbol
      type withContext = { [moo.persona.context]?: serializable_object }

      const context: unique symbol
      type withConfigs = { [moo.persona.configs]?: serializable_object }

      type context<contextScopesDef extends context.def = context.def> = contextScopesDef
      namespace context {
        type def = /* Partial< */ map<moo.persona.scope.def> & moo.persona.withConfigs // ,moo.scopes>>
      }

      type scope<scopeDef extends moo.persona.scope.def = moo.persona.scope.def> = scopeDef
      namespace scope {
        type def = map<moo.persona.usecase.def> & moo.persona.withConfigs
      }

      type usecase<usecaseDef extends usecase.def = usecase.def> = usecaseDef
      namespace usecase {
        type def = map<endpoint.def> & moo.persona.withConfigs & moo.persona.usecase.withModelTypes
        type withModelTypes = { [moo.persona.usecase.modelTypes]?: Partial<map<map<serializable_object>, moo.modelName>> }
        const modelTypes: unique symbol
      }

      type endpoint<endpointDef extends endpoint.def = endpoint.def> = [
        epType<endpointDef[0]>,
        endpointDef[1],
        endpointDef[2],
      ]
      namespace endpoint {
        type def = [message: zodTypeOrProvider, outcome: any_, configs: serializable | undefined | void]
      }
    }
  }
}
type zodTypeOrProvider = ZodType | ((...a: any_[]) => ZodType)

type epType<T extends zodTypeOrProvider> = T extends ZodType
  ? T
  : T extends (...a: any_[]) => ZodType
    ? ReturnType<T>
    : never





