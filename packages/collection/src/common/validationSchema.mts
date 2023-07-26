import type { SchemaOf } from 'yup'
import { mixed, object, string } from 'yup'
import type { CollectionFormProps } from './types.mjs'

export type ValidationsConfig = { imageMaxUploadSize: number }
export type ValidationSchemas = ReturnType<typeof getValidationSchemas>
export function getValidationSchemas({ imageMaxUploadSize }: ValidationsConfig) {
  const publishedCollectionValidationSchema = getCollectionValidationSchema({ type: 'publish' })
  const draftCollectionValidationSchema = getCollectionValidationSchema({ type: 'draft' })

  const imageValidationSchema: SchemaOf<{ image: File | string | undefined | null }> = object({
    image: mixed()
      .test((v, { createError }) => {
        return v?.location instanceof Blob && v?.location.size > imageMaxUploadSize
          ? createError({
              message: `The image file is too big, please reduce the size`,
            })
          : true
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
        .max(160)
        .withMutation(s => (forPublish ? s.min(3).required(`Please provide a title`) : s))
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
