import { HookSafeActionFn } from 'next-safe-action/hooks'

export const noop_action: HookSafeActionFn<any, any, any, any, any, any> = async () => ({})
