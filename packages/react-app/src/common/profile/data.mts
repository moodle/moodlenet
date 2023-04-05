import { mixed, object, SchemaOf, string } from 'yup'
import { ClientSessionData } from '../../webapp/web-lib.mjs'
import { AuthDataRpc, ProfileFormValues } from '../types.mjs'

export function profileFormValidationSchema(maxUploadSize: number): SchemaOf<ProfileFormValues> {
  return object({
    avatarImage: mixed()
      .test((v, { createError }) =>
        v instanceof Blob && v.size > maxUploadSize
          ? createError({
              message: /* t */ `The image is too big, reduce the size or use another image`,
            })
          : true,
      )
      .optional(),
    backgroundImage: mixed()
      .test((v, { createError }) =>
        v instanceof Blob && v.size > maxUploadSize
          ? createError({
              message: /* t */ `The image is too big, reduce the size or use another image`,
            })
          : true,
      )
      .optional(),
    displayName: string().max(160).min(3).required(/* t */ `Please provide a display name`),
    location: string().optional(),
    organizationName: string().max(30).min(3).optional(),
    siteUrl: string().url().optional(),
    aboutMe: string().max(4096).min(3).required(/* t */ `Please provide a description`),
  })
}

export const authToAccessRpc = (auth: ClientSessionData | undefined): AuthDataRpc => ({
  isRoot: false,
  access: {
    isAuthenticated: !!auth,
    isAdmin: !!auth?.isAdmin,
  },
  myProfile: auth?.myProfile,
})
