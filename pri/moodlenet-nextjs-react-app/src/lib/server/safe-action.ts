import { _nullish } from '@moodle/lib-types'
import { adoptAssetResponse } from '@moodle/module/content'
import { createSafeActionClient, SafeActionResult } from 'next-safe-action'

export const defaultSafeActionClient = createSafeActionClient()

export async function safeActionResult_to_adoptAssetResponse(
  p: Promise<SafeActionResult<any, any, any, any, any, adoptAssetResponse | void> | _nullish>,
): Promise<adoptAssetResponse> {
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
