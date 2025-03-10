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
      type dispatcher<opdef extends op.def> = (envelope: envelope<opdef>) => Promise<Either<Error4xx, opdef[2]>>

      type handle = op_ref<Models>

      type envelope<op_ extends op.def> = {
        id: string
        callTime: date_time_string
        now: date_time_string
        message: op_[1]
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
          path: path
          opType: op.type
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
        [modelNodePropName in keyof baseModelNode]?:
          | (baseModelNode[modelNodePropName] extends op.def ? impl.opHandlers<baseModelNode[modelNodePropName]> : impl<baseModelNode[modelNodePropName]>)
          | (<key extends keyof baseModelNode[modelNodePropName]>(k: key) => impl<baseModelNode[modelNodePropName][key]>)
      }

      namespace impl {
        type ctx<op_ extends op.def> = {
          now: date_time_string
          log: logger
          envelope: envelope<op_>
          model: handle
        }
        type exeArgs<op_ extends op.def> = [message: op_[1], ctx: ctx<op_>]

        type exe<op_ extends op.def> = (...exeArgs: exeArgs<op_>) => Promise<op_[2]>
        type pre<op_ extends op.def> = (...exeArgs: exeArgs<op_>) => Promise<void>
        type notImpl<op_ extends op.def> = (...exeArgs: exeArgs<op_>) => Promise<void>
        type post<op_ extends op.def> = (outcome: Either<Error4xx, op_[2]>, ...exeArgs: exeArgs<op_>) => Promise<void>

        type opHandlers<op_ extends op.def> = {
          exe?: exe<[op.type, op_[1], op_[2]]>
          pre?: pre<[op.type, op_[1], op_[2]]>
          notImpl?: notImpl<[op.type, op_[1], op_[2]]>
          post?: post<[op.type, op_[1], op_[2]]>
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

type op_ref<modelNode> = {
  [k in keyof modelNode]: modelNode[k] extends moo.model.op.def ? opImpl_ref<modelNode[k]> : op_ref<modelNode[k]>
}
type opImpl_ref<op_def extends moo.model.op.def> = op_def[0] extends 'query'
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
