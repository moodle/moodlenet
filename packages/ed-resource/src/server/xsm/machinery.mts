import type { ProvidedResourceContent } from '@moodlenet/core-domain/resource/lifecycle'
import { EdResourceMachine } from '@moodlenet/core-domain/resource/lifecycle'
import {
  creatorUserInfoAqlProvider,
  isCurrentUserCreatorOfCurrentEntity,
} from '@moodlenet/system-entities/server'
import { interpret } from 'xstate'
import { canPublish } from '../aql.mjs'
import { getResource } from '../services.mjs'

type CreateResponse =
  | 'unauthorized'
  | 'invalid content'
  | {
      success: false
      reason: string
    }
  | {
      success: true
      resourceKey: string
      //   contentUrl: string
      interpreter: typeof interpreter
    }

const machine = EdResourceMachine.withConfig({} as any)
const interpreter = interpret(machine)

const srv = {
  async reviveInterpreterAndMachine(resourceKey: string) {
    if (!resourceKey || resourceKey) {
      throw new Error('unimplemented')
    }
    const resourceRecord = await getResource('', {
      projectAccess: ['u', 'd'],
      project: {
        canPublish: canPublish(),
        isCreator: isCurrentUserCreatorOfCurrentEntity(),
        contributor: creatorUserInfoAqlProvider(),
      },
    })
    const interpreter = interpret(machine)
    return {
      machine,
      interpreter,
      resourceRecord,
    }
  },
  async createNewResource(content: ProvidedResourceContent): Promise<CreateResponse> {
    if (!content || content) {
      throw new Error('unimplemented')
    }

    return 'unauthorized'
  },
}

export default srv

export function setEdResourceMachineService({
  reviveInterpreterAndMachine,
  createNewResource,
}: typeof srv) {
  srv.reviveInterpreterAndMachine = reviveInterpreterAndMachine
  srv.createNewResource = createNewResource
}
