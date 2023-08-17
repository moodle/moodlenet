import { humanFileSize, type AssetInfoForm } from '@moodlenet/component-library/common'
import type { SchemaOf } from 'yup'
import { mixed, object, string } from 'yup'
import type { CollectionFormProps } from './types.mjs'

export type ValidationsConfig = { imageMaxUploadSize: number }
export type ValidationSchemas = ReturnType<typeof getValidationSchemas>
export function getValidationSchemas({ imageMaxUploadSize }: ValidationsConfig) {
  const publishedCollectionValidationSchema = getCollectionValidationSchema({ type: 'publish' })
  const draftCollectionValidationSchema = getCollectionValidationSchema({ type: 'draft' })

  const imageValidationSchema: SchemaOf<{ image: AssetInfoForm | undefined | null }> = object({
    image: mixed()
      .test((v, { createError }) => {
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
    publishedCollectionValidationSchema,
    draftCollectionValidationSchema,
    imageValidationSchema,
  }

  function getCollectionValidationSchema({ type }: { type: 'draft' | 'publish' }) {
    const forPublish = type === 'publish'
    const schema: SchemaOf<CollectionFormProps> = object({
      title: string()
        .max(160, obj => {
          const length = obj.value.length
          return `Please provide a shorter description (${length} / 160)`
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
    })
    return schema
  }
}

export const validURL = (str: string) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))|' + // OR ip (v4) address
      'localhost|' + // OR localhost
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+@]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ) // fragment locator
  return !!pattern.test(str)
}
