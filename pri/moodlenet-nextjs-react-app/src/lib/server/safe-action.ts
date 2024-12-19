import { _any, _nullish } from '@moodle/lib-types'
import { adoptAssetResult } from '@moodle/module/storage'
import { createSafeActionClient, SafeActionResult } from 'next-safe-action'

export const defaultSafeActionClient = createSafeActionClient()

export async function safeActionResult_to_adoptAssetResult(
  p: Promise<SafeActionResult<_any, _any, _any, _any, _any, adoptAssetResult | void> | _nullish>,
): Promise<adoptAssetResult> {
  const result = await p
  if (!result) {
    return { status: 'assetSubmitted' }
  }
  const { bindArgsValidationErrors, serverError, validationErrors, data } = result
  if (bindArgsValidationErrors || serverError || validationErrors) {
    return {
      status: 'error',
      message: `something went wrong importing asset ${JSON.stringify({ bindArgsValidationErrors, serverError, validationErrors }, null, 2)}`,
    }
  }
  if (!data) {
    return { status: 'assetSubmitted' }
  }
  return data
}
