import { _any } from '@moodle/lib-types'
import { UseHookFormActionHookReturn } from '@next-safe-action/adapter-react-hook-form/hooks'
import { ValidationErrors } from 'next-safe-action'
import { HookSafeActionFn } from 'next-safe-action/hooks'
import { ReactElement } from 'react'
import { ZodType } from 'zod'

export type clientSlotItem = ReactElement //  | string | clientSlotItem[]

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
