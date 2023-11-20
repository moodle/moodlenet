import type { Context, EdResourceMachineDeps, StateName } from '@moodlenet/core-domain/resource'
import { getEdResourceMachine } from '@moodlenet/core-domain/resource'
import type { AccessEntitiesRecordType } from '@moodlenet/system-entities/server'
import { interpret } from 'xstate'
import { patchResource } from '../services.mjs'
import type { ResourceDataType } from '../types.mjs'

export type ProvideBy =
  | {
      by: 'data'
      data: AccessEntitiesRecordType<ResourceDataType, unknown, any>
    }
  | {
      by: 'key'
      key: string
    }
  | {
      by: 'create'
    }

export type DepsAndInitializations = [deps: EdResourceMachineDeps, initializeContext: Context]

const srv = {
  stdEdResourceMachine,
  provideEdResourceMachineDepsAndInits(by: ProvideBy): Promise<DepsAndInitializations> {
    by
    throw new Error('unimplemented')
  },
}
export default srv

export async function stdEdResourceMachine(by: ProvideBy) {
  const [configs, initializeContext] = await srv.provideEdResourceMachineDepsAndInits(by)
  const machine = getEdResourceMachine(configs).withContext(initializeContext)
  const saveOnStates: StateName[] = [
    'Autogenerating-Meta',
    'Unpublished',
    'Publishing-Moderation',
    'In-Trash',
    'Published',
    'Meta-Suggestion-Available',
  ]
  const interpreter = interpret(machine).onTransition(state => {
    // https://github.com/statelyai/xstate/discussions/1294
    const currentState = state.value as StateName
    if (!saveOnStates.includes(currentState) || state.changed === undefined) {
      return
    }
    if (state.history && !state.history.matches(currentState)) {
      // console.log('persist_context', state.context)
      const persistentContext: ResourceDataType['persistentContext'] = {
        generatedData:
          currentState === 'Meta-Suggestion-Available' ? state.context.generatedData : null,
        publishRejected: currentState === 'Publish-Rejected' ? state.context.publishRejected : null,
        state: currentState,
      }

      patchResource(state.context.doc.id.resourceKey, {
        persistentContext,
        published: currentState === 'Published',
      })
    }
  })
  interpreter.start(initializeContext.state)

  return [interpreter, initializeContext, machine, configs] as const
}
export function setEdResourceMachineService(
  provideEdResourceMachineDepsAndInits: typeof srv.provideEdResourceMachineDepsAndInits,
) {
  srv.provideEdResourceMachineDepsAndInits = provideEdResourceMachineDepsAndInits
}
