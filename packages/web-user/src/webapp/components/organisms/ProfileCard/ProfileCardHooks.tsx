import { useContext, useEffect, useState } from 'react'
import { AuthCtx } from '@moodlenet/react-app/web-lib'
import { useFormik } from 'formik'
import { ProfileCardPropsControlled } from './ProfileCard.js'
import { fileExceedsMaxUploadSize } from '../../../helpers/utilities.js'
import { mixed, object, SchemaOf, string } from 'yup'
import { MainContext } from '../../../MainContext.js'
import { ProfileFormValues } from '../../../../types.mjs'

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
  displayName: string().max(160).min(3).required(/* t */ `Please provide a display name`),
  location: string().optional(),
  organizationName: string().max(30).min(3).optional(),
  siteUrl: string().url().optional(),
  description: string().max(4096).min(3).required(/* t */ `Please provide a description`),
})

export const useProfileCardProps = ({ key }: { key: string }): ProfileCardPropsControlled => {
  const { pkgs } = useContext(MainContext)
  const [profileApi] = pkgs
  const { clientSessionData } = useContext(AuthCtx)

  const [profile, setProfile] = useState<ProfileFormValues>(null as any)

  const form = useFormik<ProfileFormValues>({
    async onSubmit({ description, displayName, location, organizationName, siteUrl }) {
      const res = await profileApi.call('editProfile')(key, {
        displayName,
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
    initialValues: profile,
  })

  useEffect(() => {
    profileApi
      .call('getProfile')(key)
      .then(res => {
        if (!res) {
          return
        }
        setProfile(res)
      })
  }, [key, profileApi])

  const profileCardsProps: ProfileCardPropsControlled = {
    isOwner: clientSessionData?.myUserNode._key === key,
    isAuthenticated: !!clientSessionData,
    moreButtonItems: [],
    form,
  }
  return profileCardsProps
}
