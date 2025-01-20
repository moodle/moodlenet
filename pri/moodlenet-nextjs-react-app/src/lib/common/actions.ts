import { _any, _nullish } from '@moodle/lib-types'
import { adoptAssetResult } from '@moodle/module/storage'
import {
  adoptAssetFormSchema,
  adoptExternalAssetFormSchema,
  adoptTempFileFormSchema,
  adoptValuedAssetFormSchema,
} from '@moodle/module/storage'
import { UseHookFormActionHookReturn } from '@next-safe-action/adapter-react-hook-form/hooks'
import { ValidationErrors } from 'next-safe-action'
import { HookSafeActionFn } from 'next-safe-action/hooks'
import { ZodType } from 'zod'

export function default_noop_action<action extends HookSafeActionFn<_any, _any, _any, _any, _any, _any>>(
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
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  void | returnType
>
export type simpleUseHookFormActionHookReturn<inputSchema extends ZodType, returnType> = UseHookFormActionHookReturn<
  unknown,
  inputSchema,
  _any,
  ValidationErrors<inputSchema>,
  unknown,
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  void | returnType,
  _any
>

export type adoptValuedAssetSafeAction = simpleHookSafeAction<typeof adoptValuedAssetFormSchema, adoptAssetResult>
export type adoptTempFileAssetSafeAction = simpleHookSafeAction<typeof adoptTempFileFormSchema, adoptAssetResult>
export type adoptExternalAssetSafeAction = simpleHookSafeAction<typeof adoptExternalAssetFormSchema, adoptAssetResult>
export type adoptAssetSafeAction = simpleHookSafeAction<typeof adoptAssetFormSchema, adoptAssetResult>

