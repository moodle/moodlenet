/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { map } from '@moodle/lib-types'
import type { OPS } from '../lib/constants'

declare global {
  namespace moo {
    type model<modelDef extends map = map> = modelDef
    namespace model {
      // type ___<typeModelRef extends TypeModel<TypeModelTraits>> = Exclude<typeModelRef, undefined>
      type impl<baseModelNode = Services> = {
        [k in keyof baseModelNode]: baseModelNode[k] extends infer modelNode
          ? modelNode extends type<type.traitsDef>
            ? impl.typeModel<modelNode>
            : impl<modelNode>
          : never // or maybe `unknown` instead ?
      }

      namespace impl {
        type typeModel<modelNode extends type<type.traitsDef>> = {
          [op in OPS]: ops<modelNode>
        } & (modelNode extends type.idSpaceMap<infer space_shape, infer space_ops>
          ? { _: (id: string) => typeModel<type.modelSpace<space_shape, space_ops>> }
          : impl<Omit<modelNode, type.traits_prop>>)

        type ops<modelNode extends type<type.traitsDef>> = {
          [opName in keyof modelNode[type.traits_prop]['ops']]: op<modelNode[type.traits_prop]['ops'][opName]>
        }

        type op<modelOpDef extends type.opDef> = modelOpDef[0] extends 'query'
          ? {
              query?: (message: modelOpDef[1]) => Promise<modelOpDef[2]>
              then?: (outcome: modelOpDef[2], message: modelOpDef[1]) => Promise<void>
            }
          : modelOpDef[0] extends 'sync' | 'async'
            ? {
                cmd?: (message: modelOpDef[1]) => Promise<modelOpDef[2]>
                then?: (outcome: modelOpDef[2], message: modelOpDef[1]) => Promise<void>
              }
            : unknown
      }
    }
  }
}
