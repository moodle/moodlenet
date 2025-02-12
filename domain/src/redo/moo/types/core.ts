/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */

import { any_ } from '@moodle/lib-types'
import { ZodType } from 'zod'

declare global {
  namespace moo {
    type core = (ctx: core.ctx) => moo.gate.provider
    namespace core {
      type ctx = {
        model: Models
        over: <typeModelRef extends model.type>(
          type_model_ref: typeModelRef | undefined,
        ) => typeModelRefOpMap_impl<typeModelRef>
        session: session.user
      }

      type endpoint<endpoint_ extends persona.endpoint<any_>> = (
        payload: endpoint_[0] extends ZodType<infer ouputType, any_, any_> ? ouputType : never,
        ctx: ctx,
      ) => Promise<endpoint_[1]>
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
