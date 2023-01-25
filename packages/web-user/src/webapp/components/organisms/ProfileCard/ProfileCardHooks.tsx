import { AuthCtx } from '@moodlenet/react-app/web-lib'
import { useFormik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import { mixed, object, SchemaOf, string } from 'yup'
import { ProfileFormValues } from '../../../../server/types.mjs'
import { fileExceedsMaxUploadSize } from '../../../helpers/utilities.js'
import { MainContext } from '../../../MainContext.js'
import { ProfileCardPropsControlled } from './ProfileCard.js'

const maxUploadSize = 1024 * 1024 * 50
export const validationSchema: SchemaOf<ProfileFormValues> = object({
  avatarImage: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && fileExceedsMaxUploadSize(v.size, maxUploadSize)
        ? createError({
            message: /* t */ `The image is too big, reduce the size or use another image`,
          })
        : true,
    )
    .optional(),
  backgroundImage: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && fileExceedsMaxUploadSize(v.size, maxUploadSize)
        ? createError({
            message: /* t */ `The image is too big, reduce the size or use another image`,
          })
        : true,
    )
    .optional(),
  title: string().max(160).min(3).required(/* t */ `Please provide a display name`),
  location: string().optional(),
  organizationName: string().max(30).min(3).optional(),
  siteUrl: string().url().optional(),
  description: string().max(4096).min(3).required(/* t */ `Please provide a description`),
})

export const useProfileCardProps = ({
  profileKey,
}: {
  profileKey: string
}): ProfileCardPropsControlled => {
  const {
    use: { me },
  } = useContext(MainContext)
  const { clientSessionData } = useContext(AuthCtx)

  const [profile, setProfile] = useState<ProfileFormValues>({} as never)

  const form = useFormik<ProfileFormValues>({
    async onSubmit({ description, title, location, organizationName, siteUrl }) {
      const res = await me.rpc['webapp/profile/edit']({
        key: profileKey,
        title,
        description,
        location,
        organizationName,
        siteUrl,
      })
      if (!res) {
        return
      }
      form.setValues(res)
    },
    validationSchema,
    initialValues: profile as never,
    enableReinitialize: true,
  })

  useEffect(() => {
    me.rpc['webapp/profile/get']({ key: profileKey }).then(res => {
      if (!res) {
        return
      }
      setProfile(res)
    })
  }, [profileKey, me])

  const isOwner = clientSessionData?.myUserNode._key === profileKey
  // const profileCardsProps = useMemo(() => {
  //   const props: ProfileCardPropsControlled = {
  //     isOwner,
  //     canEdit: isOwner,
  //     isAuthenticated: !!clientSessionData,
  //     form,
  //   }
  //   return props
  // }, [clientSessionData, form, isOwner])
  const profileCardsProps: ProfileCardPropsControlled = {
    isOwner,
    canEdit: isOwner,
    isAuthenticated: !!clientSessionData,
    form,
  }
  return profileCardsProps
}
