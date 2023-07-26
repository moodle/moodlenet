import type { SchemaOf } from 'yup'
import { mixed, object, string } from 'yup'
import type { CollectionFormProps } from './types.mjs'

export type ValidationConfig = { imageMaxUploadSize: number }
export function getValidationSchemas({ imageMaxUploadSize }: ValidationConfig) {
  const formValidationSchema: SchemaOf<CollectionFormProps> = object({
    title: string().max(160).min(3).required(/* t */ `Please provide a title`),
    description: string()
      .max(4000, obj => {
        const length = obj.value.length
        return `Please provide a shorter description (${length} / 4000)`
      })
      .min(40, obj => {
        const length = obj.value.length
        return `Please provide a longer description (${length} < 40)`
      })
      .required(`Please provide a description`),
  })

  const imageValidationSchema: SchemaOf<{ image: File | string | undefined | null }> = object({
    image: mixed()
      .test((v, { createError }) =>
        v instanceof Blob && v.size > imageMaxUploadSize
          ? createError({
              message: `The file is too big, reduce the size or provide a url`,
            })
          : true,
      )
      .optional(),
  })

  return { formValidationSchema, imageValidationSchema }
}
