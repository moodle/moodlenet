import { _any, _nullish } from '@moodle/lib-types'
import { adoptExternalAssetFormSchema } from '@moodle/module/content'
import { UseHookFormActionHookReturn } from '@next-safe-action/adapter-react-hook-form/hooks'
import { ValidationErrors } from 'next-safe-action'
import { HookSafeActionFn } from 'next-safe-action/hooks'
import { ZodType } from 'zod'

export function default_noop_action<action extends HookSafeActionFn<any, any, any, any, any, any>>(
  action: action | _nullish,
): action {
  return action ?? ((async () => undefined) as _any as action)
}

export type simpleHookSafeAction<inputSchema extends ZodType, returnType> = HookSafeActionFn<
  unknown,
  inputSchema,
  _any,
  ValidationErrors<inputSchema>,
  unknown,
  void | returnType
>
export type simpleUseHookFormActionHookReturn<inputSchema extends ZodType, returnType> = UseHookFormActionHookReturn<
  unknown,
  inputSchema,
  _any,
  ValidationErrors<inputSchema>,
  unknown,
  void | returnType,
  _any
>

export type adoptExternalAssetServiceSafeAction = simpleHookSafeAction<typeof adoptExternalAssetFormSchema, undefined>
