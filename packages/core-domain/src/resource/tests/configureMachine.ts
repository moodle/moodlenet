import { produce } from 'immer'
import { assign, interpret } from 'xstate'
import { UserIssuer } from '../exports'
import { DEFAULT_CONTEXT, EdResourceMachine } from '../lifecycle.xsm'
import {
  Actor_GenerateMeta_Data,
  Actor_ModeratePublishingResource_Data,
  Actor_ScheduleDestroy_Data,
  Actor_StoreNewResource_Data,
  Actor_StoreResourceEdits_Data,
  Context,
  StateName,
} from '../types/lifecycle'

type ServiceResponse<T> = [data: T, timeout?: number]
type TestMachineConfig = {
  initialContext?: Partial<Context>
  resourceEditsValidationErrors?: Context['resourceEditsValidationErrors'][]
  contentRejectedReason?: Context['contentRejectedReason'][]
  storeNewResource_Data?: ServiceResponse<Actor_StoreNewResource_Data>[]
  storeResourceEdits_Data?: ServiceResponse<Actor_StoreResourceEdits_Data>[]
  generateMeta_Data?: ServiceResponse<Actor_GenerateMeta_Data>[]
  moderatePublishingResource_Data?: ServiceResponse<Actor_ModeratePublishingResource_Data>[]
  scheduleDestroy_Data?: ServiceResponse<Actor_ScheduleDestroy_Data>[]
}

export function userIssuer({ feats }: { feats?: Partial<UserIssuer['feats']> }) {
  const issuer: UserIssuer = {
    type: 'user',
    feats: {
      admin: false,
      creator: false,
      publisher: false,
      ...feats,
    },
  }
  return issuer
}
type ExecNames =
  | 'notify_creator'
  | 'destroy_all_data'
  | 'validate_edit_meta_and_assign_errors'
  | 'contentRejectedReason'
  | 'check_and_assign_provided_content_formally_acceptable'
  | 'StoreNewResource'
  | 'StoreResourceEdits'
  | 'MetaGenerator'
  | 'ModeratePublishingResource'
  | 'ScheduleDestroy'
export function configureTestMachine({
  storeNewResource_Data = [],
  storeResourceEdits_Data = [],
  generateMeta_Data = [],
  moderatePublishingResource_Data = [],
  scheduleDestroy_Data = [],
  contentRejectedReason = [],
  resourceEditsValidationErrors = [],
  initialContext,
}: TestMachineConfig) {
  let executions: [name: ExecNames, more?: any][] = []

  const configuredMachine = EdResourceMachine.withConfig(
    {
      actions: {
        notify_creator(_, event) {
          executions.push(['notify_creator', event.type])
        },
        destroy_all_data(_, event) {
          executions.push(['destroy_all_data', event.type])
        },
        validate_edit_meta_and_assign_errors: assign(context => {
          executions.push(['validate_edit_meta_and_assign_errors'])
          return produce(context, proxy => {
            proxy.resourceEditsValidationErrors = resourceEditsValidationErrors.shift() ?? null
          })
        }),
        validate_provided_content_and_assign_errors: assign(context => {
          executions.push(['check_and_assign_provided_content_formally_acceptable'])
          return produce(context, proxy => {
            proxy.contentRejectedReason = contentRejectedReason.shift() ?? null
          })
        }),
      },
      services: {
        async StoreNewResource(): Promise<Actor_StoreNewResource_Data> {
          executions.push(['StoreNewResource'])
          return timeoutPromise('StoreNewResource', storeNewResource_Data.shift())
        },
        async StoreResourceEdits(): Promise<Actor_StoreResourceEdits_Data> {
          executions.push(['StoreResourceEdits'])
          return timeoutPromise('StoreResourceEdits', storeResourceEdits_Data.shift())
        },
        async MetaGenerator(): Promise<Actor_GenerateMeta_Data> {
          executions.push(['MetaGenerator'])
          return timeoutPromise('MetaGenerator', generateMeta_Data.shift())
        },
        async ModeratePublishingResource(): Promise<Actor_ModeratePublishingResource_Data> {
          executions.push(['ModeratePublishingResource'])
          return timeoutPromise(
            'ModeratePublishingResource',
            moderatePublishingResource_Data.shift(),
          )
        },
        async ScheduleDestroy(): Promise<Actor_ScheduleDestroy_Data> {
          executions.push(['ScheduleDestroy'])
          return timeoutPromise('ScheduleDestroy', scheduleDestroy_Data.shift())
        },
      },
      guards: undefined as any, // Parameters<typeof EdResourceMachine.withConfig>[0]['guards']
    },
    { ...DEFAULT_CONTEXT, ...initialContext },
  )

  return [configuredMachine, executions] as const
}
export function timeoutPromise<T>(
  tag: string,
  _: undefined | [data: T, timeout?: number],
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!_) {
      return reject(new Error(`${tag} timeoutPromise called with undefined`))
    }
    const [data, timeout = 0] = _
    setTimeout(() => {
      // console.log(`${tag} resolving timeoutPromise with`, data)
      resolve(data)
    }, timeout)
  })
}

export function getTestableInterpreter(testMachineConfigs: TestMachineConfig) {
  const [configuredMachine, executions] = configureTestMachine(testMachineConfigs)
  let states: StateName[] = []

  const interpreter = interpret(configuredMachine)
  interpreter.subscribe(state => {
    states.push(state.value as StateName)
  })
  return [interpreter, states, executions, configuredMachine] as const
}
