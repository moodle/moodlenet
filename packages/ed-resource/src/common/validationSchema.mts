import { humanFileSize, type AssetInfoForm } from '@moodlenet/component-library/common'
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

  const imageValidationSchema: SchemaOf<{ image: AssetInfoForm | undefined | null }> = object({
    image: mixed()
      .test((v: AssetInfoForm, { createError }) => {
        const loc: string | File | undefined | null = v?.location
        return (
          !loc ||
          (typeof loc === 'string'
            ? validURL(loc) ||
              createError({
                message: `Url not valid`,
              })
            : loc.size <= imageMaxUploadSize ||
              createError({
                message: `Image too big ${humanFileSize(loc.size)}, max ${humanFileSize(
                  imageMaxUploadSize,
                )}`,
              }))
        )
      })
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
        .test((v: File | string | undefined | null, { createError }) => {
          const errors =
            !v ||
            (typeof v === 'string'
              ? validURL(v) ||
                createError({
                  message: `Link not valid`,
                })
              : v.size <= contentMaxUploadSize ||
                createError({
                  message: `File too big ${humanFileSize(v.size)}, max ${humanFileSize(
                    contentMaxUploadSize,
                  )}`,
                }))
          return errors
        })
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
                  return `Please provide a longer title (${length} < 3)`
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
        .withMutation(s => (forPublish ? s.required('Please provide a year') : s))
        .default(''),
      type: string()
        .withMutation(s => (forPublish ? s.required('Please provide a type') : s))
        .default(''),
    })
    return schema
  }
}

export const validURL = (str: string) => {
  try {
    new URL(str)
    return true
  } catch (err) {
    return false
  }
  // This oculd also be done using @diegoperini regex, the most complete accordint to https://mathiasbynens.be/demo/url-regex
}
