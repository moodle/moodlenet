/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { any_, map, path } from '@moodle/lib-types'

declare global {
  namespace moo {
    type model<modelDef extends map = map> = modelDef
    namespace model {
      type dispatcher = (access: access) => Promise<unknown>

      type handle = {
        model: Models
        over: <typeModelRef extends model.type>(
          type_model_ref: typeModelRef | undefined,
        ) => typeModelRefOpMap_impl<typeModelRef>
      }
      type access = {
        type: 'query' | 'sync' | 'async'
        path: path
        opname: string
        message: unknown
      }


      type impl<baseModelNode = Models> = {
        [modelNodePropName in keyof baseModelNode]: baseModelNode[modelNodePropName] extends infer modelNode
          ? /* ? wideProvider<
              modelNode extends type<type.traitsDef> ? impl.typeModel<modelNode> : impl<modelNode>,
              [modelNodePropName]
            > */ modelNode extends type<type.traitsDef>
            ? impl.typeModel<modelNode>
            : impl<modelNode>
          : never // or maybe `unknown` instead ?
      }

      namespace impl {
        type typeModel<modelNode extends type<type.traitsDef>> = handlers<modelNode> &
          (modelNode extends type.idSpaceMap<infer space_shape, any_, infer space_ops>
            ? { '#': (id: string) => typeModel<type.idSpaceModel<space_shape, space_ops>> }
            : impl<Omit<modelNode, type.traits_prop>>)

        type handlers<modelNode extends type<type.traitsDef>> = modelNode[type.traits_prop]['ops'] extends infer ops
          ? ops extends model.type.ops
            ? {
                [opName in keyof ops as `* ${string & opName}`]?: (
                  message: ops[opName][1],
                  handle: handle,
                ) => Promise<ops[opName][2]>
              } & {
                [opName in keyof ops as `| ${string & opName}`]?: (message: ops[opName][1], handle: handle) => Promise<void>
              } & {
                [opName in keyof ops as `& ${string & opName}`]?: (
                  outcome: ops[opName][2],
                  message: ops[opName][1],
                  handle: handle,
                ) => Promise<void>
              }
            : never
          : never

        // type op<modelOpDef extends type.opDef> = modelOpDef[0] extends 'query'
        //   ? {
        //       query?: (message: modelOpDef[1]) => Promise<modelOpDef[2]>
        //       then?: (outcome: modelOpDef[2], message: modelOpDef[1]) => Promise<void>
        //     }
        //   : modelOpDef[0] extends 'sync' | 'async'
        //     ? {
        //         cmd?: (message: modelOpDef[1]) => Promise<modelOpDef[2]>
        //         then?: (outcome: modelOpDef[2], message: modelOpDef[1]) => Promise<void>
        //       }
        //     : unknown
      }
    }
  }
}

type typeModelRefOpMap_impl<typeModelRef extends moo.model.type> =
  typeModelRef extends moo.model.type<infer traits>
    ? traits['ops'] extends infer opTraits
      ? opTraits extends moo.model.type.ops
        ? {
            [k in keyof opTraits]: typeModelRefOp_impl<opTraits[k]>
          }
        : never
      : never
    : never

type typeModelRefOp_impl<modelOpDef extends moo.model.type.opDef> = modelOpDef[0] extends 'query'
  ? {
      query: (message: modelOpDef[1]) => Promise<modelOpDef[2]>
    }
  : modelOpDef[0] extends 'async' | 'sync'
    ? {
        async: (message: modelOpDef[1]) => Promise<void>
      } & (modelOpDef[0] extends 'sync'
        ? {
            sync: (message: modelOpDef[1]) => Promise<modelOpDef[2]>
          }
        : unknown)
    : never
