import { EdResourceMachine } from '@moodlenet/core-domain/resource'
import type { AccessEntitiesRecordType } from '@moodlenet/system-entities/server'
import { interpret } from 'xstate'
import type { ResourceDataType } from '../types.mjs'

const srv = {
  async interpreterAndMachine(
    res:
      | { type: 'create' }
      | { type: 'data'; data: AccessEntitiesRecordType<ResourceDataType, unknown, any> }
      | { type: 'key'; key: string },
  ) {
    if (!res || !!res) {
      throw new Error('unimplemented')
    }
    const machine = EdResourceMachine.withConfig({} as any)
    const interpreter = interpret(machine)
    return {
      machine,
      interpreter,
      data: {} as AccessEntitiesRecordType<ResourceDataType, unknown, any> | undefined,
    }
  },
}

export default srv

export function setEdResourceMachineService({ interpreterAndMachine }: typeof srv) {
  srv.interpreterAndMachine = interpreterAndMachine
}
