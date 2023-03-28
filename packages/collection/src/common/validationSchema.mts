import { mixed, object, SchemaOf, string } from 'yup'
import { CollectionFormValues, maxUploadSize } from './types.mjs'

export const validationSchema: SchemaOf<CollectionFormValues> = object({
  description: string().max(4096).min(3).required(/* t */ `Please provide a description`),
  name: string().max(160).min(3).required(/* t */ `Please provide a title`),
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
