import type { SchemaOf } from 'yup'
import { mixed, object, string } from 'yup'

export const profileFormValidationSchema = object({
  avatarImage: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && v.size > 5 * 1024 ** 2
        ? createError({
            message: /* t */ `The image is too big, reduce the size or use another image`,
          })
        : true,
    )
    .optional(),
  backgroundImage: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && v.size > 5 * 1024 ** 2
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

export const messageFormValidationSchema: SchemaOf<{ msg: string }> = object({
  msg: string().min(3).max(3000).required(/* t */ `Please provide a message`),
})

// export const authToAccessRpc = (auth: ClientSessionData | undefined): AuthDataRpc => ({
//   isRoot: false,
//   access: {
//     isAuthenticated: !!auth,
//     isAdmin: !!auth?.isAdmin,
//   },
//   myProfile: auth?.myProfile,
// })
