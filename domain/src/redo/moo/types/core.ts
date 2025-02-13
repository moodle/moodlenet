/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */

import { any_, map } from '@moodle/lib-types'
import { ZodType } from 'zod'

declare global {
  namespace moo {
    type core<forPersonas extends map<moo.persona<any_>>> = {
      [personaType_ in keyof forPersonas]: core.persona<forPersonas[personaType_]>
    }
    namespace core {
      type ctx = {
        model: Models
        over: <typeModelRef extends model.type>(
          type_model_ref: typeModelRef | undefined,
        ) => typeModelRefOpMap_impl<typeModelRef>
        session: session.user
      }

      type persona<persona_ extends moo.persona<any_>> = {
        [contextName in string & keyof persona_]: persona_[contextName] extends moo.persona.context<any_>
          ? context<persona_[contextName]>
          : unknown
      }

      type context<context extends moo.persona.context<any_>> = {
        [scopeName in string & keyof context]: context[scopeName] extends moo.persona.scope<any_>
          ? scope<context[scopeName]>
          : unknown
      }

      type scope<scope extends moo.persona.scope<any_>> = {
        [useCaseName in string & keyof scope]: scope[useCaseName] extends moo.persona.usecase<any_>
          ? usecase<scope[useCaseName]>
          : never
      }

      type usecase<useCase extends moo.persona.usecase<any_>> = {
        [endpointName in string & keyof useCase]: useCase[endpointName] extends moo.persona.endpoint<any_>
          ? endpoint<useCase[endpointName]>
          : never
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
