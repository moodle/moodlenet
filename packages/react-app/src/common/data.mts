import type { SchemaOf } from 'yup'
import { object, string } from 'yup'

export const reportFormValidationSchema: SchemaOf<{ comment: string }> = object({
  comment: string()
    .max(2000, obj => {
      const length = obj.value.length
      return `Please provide a shorter comment (${length} / 2000)`
    })
    .min(20, obj => {
      const length = obj.value.length
      return `Please provide a longer comment (${length} < 20)`
    })
    .required(/* t */ `Please provide a comment`),
})
