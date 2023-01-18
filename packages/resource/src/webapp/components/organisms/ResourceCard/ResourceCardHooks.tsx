// import { AuthCtx } from '@moodlenet/react-app/web-lib'
// import { useFormik } from 'formik'
// import { useContext, useEffect, useState } from 'react'
// import { mixed, object, SchemaOf, string } from 'yup'
// import { ResourceFormValues } from '../../../../types.mjs'
// import { fileExceedsMaxUploadSize } from '../../../helpers/utilities.js'
// import { MainContext } from '../../../MainContext.js'
// import { ResourceCardPropsControlled } from './ResourceCard.js'

// const maxUploadSize = 1024 * 1024 * 50
// export const validationSchema: SchemaOf<ResourceFormValues> = object({
//   avatarImage: mixed()
//     .test((v, { createError }) =>
//       v instanceof Blob && fileExceedsMaxUploadSize(v.size, maxUploadSize)
//         ? createError({
//             message: /* t */ `The image is too big, reduce the size or use another image`,
//           })
//         : true,
//     )
//     .optional(),
//   backgroundImage: mixed()
//     .test((v, { createError }) =>
//       v instanceof Blob && fileExceedsMaxUploadSize(v.size, maxUploadSize)
//         ? createError({
//             message: /* t */ `The image is too big, reduce the size or use another image`,
//           })
//         : true,
//     )
//     .optional(),
//   displayName: string().max(160).min(3).required(/* t */ `Please provide a display name`),
//   location: string().optional(),
//   organizationName: string().max(30).min(3).optional(),
//   siteUrl: string().url().optional(),
//   description: string().max(4096).min(3).required(/* t */ `Please provide a description`),
// })

// export const useResourceCardProps = ({
//   profileKey,
// }: {
//   profileKey: string
// }): ResourceCardPropsControlled => {
//   const { me } = useContext(MainContext)
//   const { clientSessionData } = useContext(AuthCtx)

//   const [profile, setResource] = useState<ResourceFormValues>({} as any)

//   const form = useFormik<ResourceFormValues>({
//     async onSubmit({ description, displayName, location, organizationName, siteUrl }) {
//       const res = await me.call('editResource')(profileKey, {
//         displayName,
//         description,
//         location,
//         organizationName,
//         siteUrl,
//       })
//       if (!res) {
//         return
//       }
//       form.setValues(res)
//     },
//     validationSchema,
//     initialValues: profile,
//     enableReinitialize: true,
//   })

//   useEffect(() => {
//     me.call('getResource')(profileKey).then(res => {
//       if (!res) {
//         return
//       }
//       setResource(res)
//     })
//   }, [profileKey, me])

//   const isOwner = clientSessionData?.myUserNode._key === profileKey
//   // const profileCardsProps = useMemo(() => {
//   //   const props: ResourceCardPropsControlled = {
//   //     isOwner,
//   //     canEdit: isOwner,
//   //     isAuthenticated: !!clientSessionData,
//   //     form,
//   //   }
//   //   return props
//   // }, [clientSessionData, form, isOwner])
//   const profileCardsProps: ResourceCardPropsControlled = {
//     isOwner,
//     canEdit: isOwner,
//     isAuthenticated: !!clientSessionData,
//     form,
//   }
//   return profileCardsProps
// }
