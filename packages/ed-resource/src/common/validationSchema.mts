import type { SchemaOf } from 'yup'
import { mixed, object, string } from 'yup'
import type { ResourceFormProps } from './types.mjs'
export const maxUploadSize = 1024 * 1024 * 50

export const resourceValidationSchema: SchemaOf<ResourceFormProps> = object({
  title: string().max(160).min(3).required(/* t */ `Please provide a title`),
  description: string().max(4096).min(3).required(/* t */ `Please provide a description`),
  subject: string().required(/* t */ `Please select a subject`),
  license: string().required(/* t */ `Please provide a license`),
  language: string().optional(),
  level: string().optional(),
  month: string().optional(),
  type: string().optional(),
  year: string().when('month', (month, schema) => {
    return month ? schema.required(/* t */ `Please select a year`) : schema.optional()
  }),
})

export const contentValidationSchema: SchemaOf<{ content: File | string | undefined | null }> =
  object({
    content: string().required(`Please upload a content or a link`),
  })

export const imageValidationSchema: SchemaOf<{ image: File | string | undefined | null }> = object({
  image: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && v.size > maxUploadSize
        ? createError({
            message: /* t */ `The file is too big, reduce the size or provide a url`,
          })
        : true,
    )
    .optional(),
})
