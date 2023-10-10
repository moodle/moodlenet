import { humanFileSize } from '@moodlenet/component-library/common'
import type { SchemaOf } from 'yup'
import { mixed, object, string } from 'yup'
import type { EditProfileDataRpc } from './expose-def.mjs'

export type ValidationsConfig = { imageMaxUploadSize: number }
export type ValidationSchemas = ReturnType<typeof getValidationSchemas>

export const displayNameSchema = string()
  .max(60, obj => `Please provide a shorter display name (${obj.value.length} / 60)`)
  .min(3, obj => `Please provide a longer display name (${obj.value.length} < 3)`)
  .required(`Please provide a display name`)

export function getValidationSchemas({ imageMaxUploadSize }: ValidationsConfig) {
  const avatarImageValidation: SchemaOf<{ image: File | string | undefined | null }> = object({
    image: mixed()
      .test((loc: string | File | undefined | null, { createError }) => {
        const errors =
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
        return errors
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
                message: `Image too big ${humanFileSize(loc.size)}, max ${humanFileSize(
                  imageMaxUploadSize,
                )}`,
              }))
        )
      })
      .optional(),
  })

  const profileValidationSchema: SchemaOf<EditProfileDataRpc> = object({
    displayName: displayNameSchema,
    location: string()
      .max(60, obj => `Please provide a shorter location (${obj.value.length} / 60)`)
      .min(3, obj => `Please provide a longer location (${obj.value.length} < 3)`)
      .optional(),
    organizationName: string().max(30).optional(),
    siteUrl: string()
      .max(160, obj => `Please provide a shorter url (${obj.value.length} / 160)`)
      .min(3, obj => `Please provide a longer url (${obj.value.length} < 3)`)
      .url()
      .optional(),
    aboutMe: string()
      .max(500, obj => `Please provide a shorter description (${obj.value.length} / 500)`)
      .min(3, obj => `Please provide a longer description (${obj.value.length} < 3)`)
      .required(`Please provide a description`),
  })

  const messageFormValidationSchema: SchemaOf<{ msg: string }> = object({
    msg: string()
      .max(3000, obj => `Please provide a shorter message (${obj.value.length} / 3000)`)
      .min(3, obj => `Please provide a longer message (${obj.value.length} < 3)`)
      .required(`Please provide a message`),
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
