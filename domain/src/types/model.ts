/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { any_, date_time_string, map, path, serializable_object } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { Error4xx } from '../lib'
import { logger } from './log'

declare global {
  namespace moo {
    type model<modelDef extends model.def, x_types extends model.xTypes<any_> = model.xTypes<any_>> = modelDef & { [model.xTypes.tag]: x_types }
    namespace model {
      type xTypes<xTypeDef extends xTypes.def> = xTypeDef
      namespace xTypes {
        const tag: unique symbol
        type def = { [n in moo.modelName]?: map<serializable_object> }
        type blueprint<selectedModelName extends modelName> = {
          [model_name in modelName]: Models[model_name] extends infer model
            ? model extends { [tag]: infer xModelTypes }
              ? xModelTypes extends { [xTypeName_ in selectedModelName]: infer _xType }
                ? _xType
                : never
              : never
            : never
        }
      }

      type def = {
        [moo.configs]: serializable_object
      }
      type dispatcher = (access: access<type.opDef>) => Promise<unknown>

      type handle = {
        model: Models
        over: <typeModelRef extends model.type>(type_model_ref: typeModelRef | undefined) => typeModelRefOpMap_impl<typeModelRef>
      }
      type access<op extends type.opDef> = {
        id: string
        callTime: date_time_string
        now: date_time_string
        message: op[1]
        origin: access.origin //<type.opDef>
        target: access.target //<op>
      }

      namespace access {
        // type target<op extends type.opDef> = {
        //   opName: string
        //   path: path
        //   type: op[0]
        // }
        type target = {
          opName: string
          path: path
          type: type.opType
        }

        type origin = {
          //<op extends type.opDef> = {
          useCase:
            | string
            | {
                id: string
                path: path
              }
          from: false | target //<op>
        }
      }

      type impl<baseModelNode = Models> = {
        [modelNodePropName in keyof baseModelNode]?: baseModelNode[modelNodePropName] extends infer modelNode
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
          access: access<op>
        }
        type exeArgs<op extends type.opDef> = [message: op[1], handle: handle, ctx: ctx<op>]
        type typeModel<modelNode extends type<type.traitsDef>> = handlers<modelNode> &
          (modelNode extends type.idSpaceMap<infer space_shape, any_, infer space_ops>
            ? { '#': (id: string) => typeModel<type.idSpaceModel<space_shape, space_ops>> }
            : impl<Omit<modelNode, type.traits_prop>>)

        type exe<op extends model.type.opDef> = (...exeArgs: exeArgs<op>) => Promise<op[2]>
        type or<op extends model.type.opDef> = (...exeArgs: exeArgs<op>) => Promise<void>
        type and<op extends model.type.opDef> = (outcome: Either<Error4xx, op[2]>, ...exeArgs: exeArgs<op>) => Promise<void>

        type handlers<modelNode extends type<type.traitsDef>> = modelNode[type.traits_prop]['ops'] extends infer ops
          ? ops extends model.type.ops
            ? {
                [opName in keyof ops as `* ${string & opName}`]?: exe<[type.opType, ops[opName][1], ops[opName][2]]> //exe<ops[opName]>
              } & {
                [opName in keyof ops as `| ${string & opName}`]?: or<[type.opType, ops[opName][1], ops[opName][2]]> //or<ops[opName]>
              } & {
                [opName in keyof ops as `& ${string & opName}`]?: and<[type.opType, ops[opName][1], ops[opName][2]]> //and<ops[opName]>
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
