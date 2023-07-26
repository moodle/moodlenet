import type { SchemaOf } from 'yup'
import { mixed, object, string } from 'yup'
import type { EditProfileDataRpc } from './expose-def.mjs'

export type ValidationsConfig = { imageMaxUploadSize: number }
export type ValidationSchemas = ReturnType<typeof getValidationSchemas>

export const displayNameSchema = string()
  .max(160)
  .min(3)
  .required(/* t */ `Please provide a display name`)

export function getValidationSchemas({ imageMaxUploadSize }: ValidationsConfig) {
  const imageValidationSchema: SchemaOf<{ image: File | string | undefined | null }> = object({
    image: mixed()
      .test((v, { createError }) => {
        return v instanceof Blob && v.size > imageMaxUploadSize
          ? createError({
              message: `The image file is too big, please reduce the size`,
            })
          : true
      })
      .optional(),
  })

  const profileValidationSchema: SchemaOf<EditProfileDataRpc> = object({
    displayName: displayNameSchema,
    aboutMe: string().min(3).max(4000).required(),
    location: string().max(4000),
    organizationName: string().max(4000),
    siteUrl: string().max(4000),
  })

  return { displayNameSchema, imageValidationSchema, profileValidationSchema }
}
