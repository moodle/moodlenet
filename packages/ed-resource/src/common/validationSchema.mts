import type { SchemaOf } from 'yup'
import { mixed, object, string } from 'yup'
import type { ResourceFormProps } from './types.mjs'

export type ValidationsConfig = {
  contentMaxUploadSize: number
  imageMaxUploadSize: number
}

export type ValidationSchemas = ReturnType<typeof getValidationSchemas>
export function getValidationSchemas({
  contentMaxUploadSize,
  imageMaxUploadSize,
}: ValidationsConfig) {
  const publishedResourceValidationSchema = getResourceValidationSchema({ type: 'publish' })
  const draftResourceValidationSchema = getResourceValidationSchema({ type: 'draft' })
  const publishedContentValidationSchema = getContentValidationSchema({ type: 'publish' })
  const draftContentValidationSchema = getContentValidationSchema({ type: 'draft' })

  const imageValidationSchema: SchemaOf<{ image: File | string | undefined | null }> = object({
    image: mixed()
      .test((v, { createError }) =>
        v instanceof Blob && v.size > imageMaxUploadSize
          ? createError({
              message: `The image file is too big, please reduce the size`,
            })
          : true,
      )
      .optional(),
  })

  return {
    publishedResourceValidationSchema,
    draftResourceValidationSchema,
    publishedContentValidationSchema,
    draftContentValidationSchema,
    imageValidationSchema,
  }

  function getContentValidationSchema({ type }: { type: 'publish' | 'draft' }) {
    const forPublish = type === 'publish'
    const schema: SchemaOf<{ content: File | string | undefined | null }> = object({
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
                message: `The file is too big, please reduce the size or provide a url`,
              })
            : true,
        )
        .withMutation(s =>
          forPublish ? s.required(`Please upload a content or a link`) : s.optional(),
        ),
    })
    return schema
  }

  function getResourceValidationSchema({ type }: { type: 'publish' | 'draft' }) {
    const forPublish = type === 'publish'
    const schema: SchemaOf<ResourceFormProps> = object({
      title: string()
        .max(160, obj => {
          const length = obj.value.length
          return `Please provide a shorter title (${length} / 160)`
        })
        .withMutation(s =>
          forPublish
            ? s
                .min(3, obj => {
                  const length = obj.value.length
                  return `Please provide a longer title (${length} < 30)`
                })
                .required(`Please provide a title`)
            : s,
        )
        .default(''),
      description: string()
        .max(4000, obj => {
          const length = obj.value.length
          return `Please provide a shorter description (${length} / 4000)`
        })
        .withMutation(s =>
          forPublish
            ? s
                .min(40, obj => {
                  const length = obj.value.length
                  return `Please provide a longer description (${length} < 40)`
                })
                .required(`Please provide a description`)
            : s,
        )
        .default(''),
      subject: string()
        .withMutation(s => (forPublish ? s.required(`Please select a subject`) : s))
        .default(''),
      license: string()
        .withMutation(s => (forPublish ? s.required(`Please provide a license`) : s))
        .default(''),
      language: string()
        .withMutation(s => (forPublish ? s.required('Please provide a language') : s))
        .default(''),
      level: string()
        .withMutation(s => (forPublish ? s.required('Please provide a level') : s))
        .default(''),
      month: string()
        .withMutation(s => (forPublish ? s.required('Please provide a month') : s))
        .default(''),
      year: string()
        .when('month', (month, schema) => {
          return month ? schema.required(`Please select a year`) : schema
        })
        .default(''),
      type: string()
        .withMutation(s => (forPublish ? s.required('Please provide a type') : s))
        .default(''),
    })
    return schema
  }
}

export const validURL = (str: string) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ) // fragment locator
  return !!pattern.test(str)
}
