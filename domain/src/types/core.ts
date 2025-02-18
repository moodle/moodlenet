/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */

import { any_, date_time_string, map } from '@moodle/lib-types'
import { logger } from './log'

declare global {
  namespace moo {
    type core<forPersonas extends map<moo.persona<any_>>> = {
      [personaType_ in keyof forPersonas]: core.persona<forPersonas[personaType_]>
    }
    namespace core {
      type access<endpoint_ extends persona.endpoint<any_>> = {
        id: string
        now: date_time_string
        session: session.user
        gate: gate.access<endpoint_>
      }

      type ctx<endpoint_ extends persona.endpoint<any_>> = {
        configs: endpoint_[2]
        log: logger
        handle: moo.model.handle
        access: access<endpoint_>
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

      type endpointArg<endpoint_ extends persona.endpoint<any_>> = {
        ctx: ctx<endpoint_>
        assertContextChecks: endpoint_[3] extends never | undefined | null | void
          ? undefined
          : (
              context: endpoint_[3] extends never | undefined | null | void ? void : endpoint_[3],
            ) => /* Error4xx |  */ undefined
        zod: gate.endpointZod<endpoint_>
      }

      type endpoint<endpoint_ extends persona.endpoint<any_>> = (_: endpointArg<endpoint_>) => Promise<endpoint_[1]>
    }
  }
}
