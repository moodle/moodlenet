/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */

import { date_time_string, map } from '@moodle/lib-types'
import { logger } from './log'

type voidable<t> = t extends never | undefined | void ? void : t
declare global {
  namespace moo.def {
    type core<forUserTypes extends map<moo.def.userType> = moo<UserType>> = core.branch<forUserTypes>

    namespace core {
      type branch<node_> = {
        _?: voidable<moo.def.tagType<node_, moo.def.tags.context>>
      } & (node_ extends moo.def.userType.endpoint
        ? {
            $: userType.endpointFunction<node_>
          }
        : {
            [key in string & keyof node_]: node<node_[key]>
          })

      type node<node_> = (env: env<node_>) => Promise<branch<node_>>

      type env<branch_> = {
        model: moo.def.model.handle
        log: logger
        configs: moo.def.tagType<branch_, moo.def.tags.configs>
        request: request
      }

      type request = {
        id: string
        now: date_time_string
        userPoliciesInfo: def.policies.user.info
        gateRequest: {
          [k in keyof def.gate.provider.request]: k extends 'form' ? unknown : def.gate.provider.request[k]
        }
      }
    }
  }
}

