import { useFormik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import { mixed, object, SchemaOf, string } from 'yup'
import { ProfileFormValues } from '../../../../../common/types.mjs'
import { MainContext } from '../../../../context/MainContext.mjs'
import { AuthCtx } from '../../../../web-lib.mjs'
import { fileExceedsMaxUploadSize } from '../../../helpers/utilities.js'
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
  displayName: string().max(160).min(3).required(/* t */ `Please provide a display name`),
  location: string().optional(),
  organizationName: string().max(30).min(3).optional(),
  siteUrl: string().url().optional(),
  aboutMe: string().max(4096).min(3).required(/* t */ `Please provide a description`),
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
    async onSubmit({
      aboutMe: description,
      displayName: title,
      location,
      organizationName,
      siteUrl,
    }) {
      const res = await me.rpc['webapp/profile/edit']({
        _key: profileKey,
        displayName: title,
        aboutMe: description,
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
    me.rpc['webapp/profile/get']({ _key: profileKey }).then(res => {
      if (!res) {
        return
      }
      setProfile(res)
    })
  }, [profileKey, me])

  const isCreator = clientSessionData?.myProfile?._key === profileKey
  // const profileCardsProps = useMemo(() => {
  //   const props: ProfileCardPropsControlled = {
  //     isCreator,
  //     canEdit: isCreator,
  //     isAuthenticated: !!clientSessionData,
  //     form,
  //   }
  //   return props
  // }, [clientSessionData, form, isCreator])
  const profileCardsProps: ProfileCardPropsControlled = {
    // TODO Replace all the fields data with meaningfull ones
    slots: {
      mainColumnItems: [],
      topItems: [],
      titleItems: [],
      subtitleItems: [],
      footerRowItems: [],
    },
    form,
    state: {
      followed: false,
    },
    access: {
      isAdmin: false, //TODO Fix props
      isCreator,
      canEdit: isCreator, // TODO This could be also an admin with the rights to edit @
      isAuthenticated: !!clientSessionData,
    },
    actions: {
      editProfile: () => undefined,
      toggleFollow: () => undefined,
    },
  }
  return profileCardsProps
}
