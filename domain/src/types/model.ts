/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { any_, d_u, date_time_string, path } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { Error4xx } from '../lib'
import { logger } from './log'

declare global {
  namespace moo {
    type model<modelDef extends model.def> = modelDef
    namespace model {
      type def = {
        [moo.tags.configs]: unknown
      }
      type dispatcher<opdef extends ops.opDef> = (envelope: envelope<opdef>) => Promise<Either<Error4xx, opdef[2]>>

      type handle = {
        model: Models
        over: <typeModelRef extends model.ops>(type_model_ref: typeModelRef | undefined) => opsImpl_ref<typeModelRef>
      }
      type envelope<op extends ops.opDef> = {
        id: string
        callTime: date_time_string
        now: date_time_string
        message: op[1]
        origin: envelope.origin //<type.opDef>
        target: envelope.target //<op>
      }

      namespace envelope {
        // type target<op extends type.opDef> = {
        //   opName: string
        //   path: path
        //   type: op[0]
        // }
        type target = {
          opName: string
          path: path
          type: ops.opType
        }

        type origin = {
          //<op extends type.opDef> = {
          gate: d_u<
            {
              internal: { name: string; more?: unknown }
              core: { id: string; gateRequest: Pick<gate.provider.request<persona.endpoint<any_>>, 'path' | 'info'> }
            },
            'kind'
          >

          from: false | { id: string; target: target } //<op>
        }
      }

      type impl<baseModelNode = Models> = {
        [modelNodePropName in Exclude<keyof baseModelNode, model.ops_prop>]?: baseModelNode[modelNodePropName] extends infer modelNode
          ? /* ? wideProvider<
              modelNode extends type<type.traitsDef> ? impl.typeModel<modelNode> : impl<modelNode>,
              [modelNodePropName]
            > */ (modelNode extends model.ops
            ? impl.withOpHandlers<modelNode[model.ops_prop]>
            :unknown) & impl<modelNode> | (<key extends keyof modelNode>(k: key) => impl<modelNode[key]>)
          : never // or maybe `unknown` instead ?
      }

      namespace impl {
        type ctx<op extends ops.opDef> = {
          now: date_time_string
          log: logger
          envelope: envelope<op>
        }
        type exeArgs<op extends ops.opDef> = [message: op[1], handle: handle, ctx: ctx<op>]

        type exe<op extends model.ops.opDef> = (...exeArgs: exeArgs<op>) => Promise<op[2]>
        type pre<op extends model.ops.opDef> = (...exeArgs: exeArgs<op>) => Promise<void>
        type notImpl<op extends model.ops.opDef> = (...exeArgs: exeArgs<op>) => Promise<void>
        type post<op extends model.ops.opDef> = (outcome: Either<Error4xx, op[2]>, ...exeArgs: exeArgs<op>) => Promise<void>

        type withOpHandlers<ops_def extends model.ops.def> = {
          $?: {
            [opName in keyof ops_def /* as `_${string & opName}` */]?: {
              exe?: exe<[ops.opType, ops_def[opName][1], ops_def[opName][2]]>
              pre?: pre<[ops.opType, ops_def[opName][1], ops_def[opName][2]]>
              notImpl?: notImpl<[ops.opType, ops_def[opName][1], ops_def[opName][2]]>
              post?: post<[ops.opType, ops_def[opName][1], ops_def[opName][2]]>
            }
          }
        }

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

type opsImpl_ref<opsRef extends moo.model.ops> = {
  [k in keyof opsRef[moo.model.ops_prop]]: opImpl_ref<opsRef[moo.model.ops_prop][k]>
}

type opImpl_ref<op_def extends moo.model.ops.opDef> = op_def[0] extends 'query'
  ? {
      query: (message: op_def[1]) => Promise<op_def[2]>
    }
  : op_def[0] extends 'async' | 'sync'
    ? {
        async: (message: op_def[1]) => Promise<void>
      } & (op_def[0] extends 'sync'
        ? {
            sync: (message: op_def[1]) => Promise<op_def[2]>
          }
        : unknown)
    : never
