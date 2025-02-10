/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { map } from '@moodle/lib-types'

declare global {
  namespace moo {
    type model<modelDef extends map = map> = modelDef
    namespace model {
      type impl<baseModelNode = Models> = {
        [modelNodePropName in keyof baseModelNode]: baseModelNode[modelNodePropName] extends infer modelNode
          ? /* ? wideProvider<
              modelNode extends type<type.traitsDef> ? impl.typeModel<modelNode> : impl<modelNode>,
              [modelNodePropName]
            > */
            modelNode extends type<type.traitsDef>
            ? impl.typeModel<modelNode>
            : impl<modelNode>
          : never // or maybe `unknown` instead ?
      }

      namespace impl {
        type typeModel<modelNode extends type<type.traitsDef>> = {
          $: ops<modelNode>
        } & (modelNode extends type.idSpaceMap<infer space_shape, infer space_ops>
          ? { '#': (id: string) => typeModel<type.modelSpace<space_shape, space_ops>> }
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
