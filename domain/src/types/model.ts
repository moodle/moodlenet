/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { any_, d_u, date_time_string, path } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { Error4xx } from '../lib'
import { logger } from './log'

declare global {
  namespace moo {
    namespace def {
      type model<modelDef> = modelDef
      namespace model {
        type dispatcher<opdef extends op.def = op.def> = (envelope: envelope<opdef>) => Promise<Either<Error4xx, opdef[2]>>

        type handle = op_ref<Models>

        type envelope<op_ extends op.def> = envelope.target & {
          id: string
          callTime: date_time_string
          now: date_time_string
          message: op_[1]
          origin: envelope.origin //<type.opDef>
        }

        namespace envelope {
          // type target<op extends type.opDef> = {
          //   opName: string
          //   path: path
          //   type: op[0]
          // }
          type target = {
            path: path
            opType: op.type
          }

          type origin = {
            //<op extends type.opDef> = {
            request: d_u<
              {
                internal: { name: string; more?: unknown }
                core: { id: string; gateRequest: Pick<def.gate.provider.request<def.userType.endpoint<any_>>, 'path' | 'info'> }
              },
              'kind'
            >

            model: false | { id: string; target: target } //<op>
          }
        }

        type impl<baseModelNode = Models> = baseModelNode extends op
          ? impl.opHandlers<baseModelNode>
          :
              | {
                  [modelNodePropName in keyof baseModelNode]?: impl<baseModelNode[modelNodePropName]>
                }
              | (<key extends keyof baseModelNode>(param: key) => impl<baseModelNode[key]>)
        namespace impl {
          type ctx<op_ extends op.def> = {
            now: date_time_string
            log: logger
            envelope: envelope<op_>
            model: handle
          }
          // type exeArgs<op_ extends op.def> = [message: op_[1], ctx: ctx<op_>]

          type exe<op_ extends op.def> = (ctx: ctx<op_>) => op.fn<op_> // (message: op.msg<op_>) => Promise<op_[2]>)
          type pre<op_ extends op.def> = (ctx: ctx<op_>) => (message: op.msg<op_>) => Promise<void>
          type notImpl<op_ extends op.def> = (ctx: ctx<op_>) => (message: op.msg<op_>) => Promise<void>
          type post<op_ extends op.def> = (ctx: ctx<op_>) => (outcome: Either<Error4xx, op.res<op_>>, message: op.msg<op_>) => Promise<void>

          type opHandlers<op_ extends op = op> = {
            exe?: exe<op_>
            // exe?: exe<[op.type, op_[1], op_[2]]>
            pre?: pre<op_>
            // pre?: pre<[op.type, op_[1], op_[2]]>
            notImpl?: notImpl<op_>
            // notImpl?: notImpl<[op.type, op_[1], op_[2]]>
            post?: post<op_>
            // post?: post<[op.type, op_[1], op_[2]]>
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
}

type op_ref<modelNode> = {
  [k in keyof modelNode]: modelNode[k] extends moo.def.model.op.def ? opImpl_ref<modelNode[k]> : op_ref<modelNode[k]>
}
type opImpl_ref<op_def extends moo.def.model.op.def> = op_def[0] extends 'query'
  ? {
      query: moo.def.model.op.fn<op_def>
    }
  : {
      async: (message: moo.def.model.op.msg<op_def>) => Promise<void>
    } & (op_def[0] extends 'sync'
      ? {
          sync: moo.def.model.op.fn<op_def>
        }
      : unknown)
