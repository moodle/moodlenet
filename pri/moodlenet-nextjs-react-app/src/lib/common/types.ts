import { _any } from '@moodle/lib-types'
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
