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
  const avatarImageValidation: SchemaOf<{ image: File | string | undefined | null }> = object({
    image: mixed()
      .test((loc: string | File | undefined | null, { createError }) => {
        return (
          !loc ||
          (typeof loc === 'string'
            ? validURL(loc) ||
              createError({
                message: `Url not valid`,
              })
            : loc.size <= imageMaxUploadSize ||
              createError({
                message: `The image file is too big, please reduce the size`,
              }))
        )
      })
      .optional(),
  })

  const backgroundImageValidation: SchemaOf<{ image: File | string | undefined | null }> = object({
    image: mixed()
      .test((loc: string | File | undefined | null, { createError }) => {
        return (
          !loc ||
          (typeof loc === 'string'
            ? validURL(loc) ||
              createError({
                message: `Url not valid`,
              })
            : loc.size <= imageMaxUploadSize ||
              createError({
                message: `The image file is too big, please reduce the size`,
              }))
        )
      })
      .optional(),
  })

  const profileValidationSchema: SchemaOf<EditProfileDataRpc> = object({
    displayName: displayNameSchema,
    location: string().optional(),
    organizationName: string().max(30).optional(),
    siteUrl: string().url().optional(),
    aboutMe: string().max(4096).min(3).required(/* t */ `Please provide a description`),
  })

  const messageFormValidationSchema: SchemaOf<{ msg: string }> = object({
    msg: string().min(3).max(3000).required(/* t */ `Please provide a message`),
  })

  return {
    displayNameSchema,
    backgroundImageValidation,
    avatarImageValidation,
    profileValidationSchema,
    messageFormValidationSchema,
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
