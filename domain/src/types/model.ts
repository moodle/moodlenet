/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { any_, date_time_string, map, path } from '@moodle/lib-types'
import { logger } from './log'
import { Either } from 'fp-ts/Either'
import { Error4xx } from '../lib'

declare global {
  namespace moo {
    type model<modelDef extends map = map> = modelDef
    namespace model {
      type dispatcher = (access: access<any_>) => Promise<unknown>

      type handle = {
        model: Models
        over: <typeModelRef extends model.type>(
          type_model_ref: typeModelRef | undefined,
        ) => typeModelRefOpMap_impl<typeModelRef>
      }
      type access<op extends type.opDef> = {
        dateTime: date_time_string
        message: op[1]
        origin: access.origin
        target: access.target
      }

      namespace access {
        type target = {
          id: string
          opName: string
          path: path
          type: 'query' | 'sync' | 'async'
        }
        type origin = {
          useCase: {
            id: string
            path: path
          }
          from: false | target
        }
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
        type ctx<op extends type.opDef> = {
          now: date_time_string
          log: logger
          handle: handle
          access: access<op>
        }
        type typeModel<modelNode extends type<type.traitsDef>> = handlers<modelNode> &
          (modelNode extends type.idSpaceMap<infer space_shape, any_, infer space_ops>
            ? { '#': (id: string) => typeModel<type.idSpaceModel<space_shape, space_ops>> }
            : impl<Omit<modelNode, type.traits_prop>>)

        type exe<op extends model.type.opDef> = (ctx: ctx<op>) => Promise<op[2]>
        type or<op extends model.type.opDef> = (ctx: ctx<op>) => Promise<void>
        type and<op extends model.type.opDef> = (outcome: Either<Error4xx, op[2]>, ctx: ctx<op>) => Promise<void>

        type handlers<modelNode extends type<type.traitsDef>> = modelNode[type.traits_prop]['ops'] extends infer ops
          ? ops extends model.type.ops
            ? {
                [opName in keyof ops as `* ${string & opName}`]?: exe<ops[opName]>
              } & {
                [opName in keyof ops as `| ${string & opName}`]?: or<ops[opName]>
              } & {
                [opName in keyof ops as `& ${string & opName}`]?: and<ops[opName]>
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
