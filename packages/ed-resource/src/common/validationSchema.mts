import { validURL } from '@moodlenet/react-app/ui'
import type { SchemaOf } from 'yup'
import { mixed, object, string } from 'yup'
import type { ResourceFormProps } from './types.mjs'

export type ValidationConfig = {
  contentMaxUploadSize: number
  imageMaxUploadSize: number
}
export function getValidationSchemas({
  contentMaxUploadSize,
  imageMaxUploadSize,
}: ValidationConfig) {
  const resourcePublishValidationSchema: SchemaOf<ResourceFormProps> = object({
    title: string().max(160).min(3).required(`Please provide a title`),
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
    subject: string().required(`Please select a subject`),
    license: string().required(`Please provide a license`),
    language: string().required('Please provide a language'),
    level: string().required('Please provide a level'),
    month: string().required('Please provide a month'),
    year: string().required('Please provide a year'),
    type: string().required('Please provide a type'),
    // year: string().when('month', (month, schema) => {
    //   return month ? schema.required( `Please select a year`) : schema.required()
    // }),
  })

  const contentValidationSchema: SchemaOf<{ content: File | string | undefined | null }> = object({
    content: mixed()
      .test((v, { createError }) =>
        typeof v === 'string'
          ? validURL(v)
            ? true
            : createError({
                message: `Url not valid`,
              })
          : true,
      )
      .test((v, { createError }) =>
        v instanceof Blob && v.size > contentMaxUploadSize
          ? createError({
              message: `The file is too big, reduce the size or provide a url`,
            })
          : true,
      )
      .required(`Please upload a content or a link`),
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

  return {
    resourcePublishValidationSchema,
    contentValidationSchema,
    imageValidationSchema,
  }
}
