import type { z } from 'zod'
import { number, object } from 'zod'

export type webImageResizesForm = z.infer<
  ReturnType<typeof getStoragePrimarySchemas>['webImageResizes']
>

export function getStoragePrimarySchemas() {
  const nonNegativeInt = number().int().nonnegative()
  const webImageResizes = object({
    small: nonNegativeInt,
    medium: nonNegativeInt,
    large: nonNegativeInt,
  }).superRefine(({ large, medium, small }, ctx) => {
    if (large <= medium || medium <= small) {
      ctx.addIssue({
        code: 'custom',
        message: 'sizes must be consistently growing from small to large',
        path: ['large', 'medium', 'small'],
      })
    }
    return false
  })
  const uploadMaxSize = object({
    webImage: nonNegativeInt,
    max: nonNegativeInt,
  })

  return {
    raw: { imageSizeSchema: nonNegativeInt },
    uploadMaxSize,
    webImageResizes,
  }
}
