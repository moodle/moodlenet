import { string } from 'yup'

export type ValidationConfig = { imageMaxUploadSize: number }
export function getValidationSchemas({ imageMaxUploadSize }: ValidationConfig) {
  const displayNameSchema = string()
    .max(160)
    .min(3)
    .required(/* t */ `Please provide a display name`)

  return { displayNameSchema }
}
