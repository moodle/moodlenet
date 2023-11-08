import type { ProvidedResourceContent } from '@moodlenet/core-domain/resource/lifecycle'
import { EdResourceMachine } from '@moodlenet/core-domain/resource/lifecycle'
import { interpret } from 'xstate'

type CreateRespponse =
  | 'cannot create'
  | 'invalid content'
  | {
      success: false
      reason: string
      resourceKey?: undefined
    }
  | {
      success: true
      resourceKey: string
      reason?: undefined
    }

const srv = {
  async reviveInterpreterAndMachine(resourceKey: string) {
    if (!resourceKey || resourceKey) {
      throw new Error('unimplemented')
    }
    const machine = EdResourceMachine.withConfig({} as any)
    return {
      machine,
      interpreter: interpret(machine),
    }
  },
  async createNewResource(content: ProvidedResourceContent): Promise<CreateRespponse> {
    if (!content || content) {
      throw new Error('unimplemented')
    }
    return { success: false, reason: `unimplemented` }
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
