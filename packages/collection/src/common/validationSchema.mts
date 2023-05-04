import type { SchemaOf } from 'yup'
import { mixed, object, string } from 'yup'
import type { CollectionFormProps } from './types.mjs'
import { maxUploadSize } from './types.mjs'

export const validationSchema: SchemaOf<CollectionFormProps> = object({
  description: string().max(4096).min(3).required(/* t */ `Please provide a description`),
  title: string().max(160).min(3).required(/* t */ `Please provide a title`),
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
