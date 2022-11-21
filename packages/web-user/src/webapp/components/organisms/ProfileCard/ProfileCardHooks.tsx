import { useContext, useEffect, useState } from 'react'
import { AuthCtx } from '@moodlenet/react-app/web-lib'
import { useFormik } from 'formik'
import { ProfileCardProps, ProfileCardPropsOmited } from './ProfileCard.js'
import { ProfileFormValues } from '../../../types.mjs'
import { fileExceedsMaxUploadSize, randomIntFromInterval } from '../../../helpers/utilities.js'
import { people } from '../../../helpers/factories.js'
import { mixed, object, SchemaOf, string } from 'yup'
import { MainContext } from '../../../MainContext.js'

type RespCall =
  | { success: true }
  | {
      success: false
      msg: string
    }

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

const overrides = {
  editFormValues: {},
  props: {},
}

const person = people[randomIntFromInterval(0, 3)]

const profileDefault = {
  displayName: person ? person.displayName : '',
  description:
    'Italian biologist specialized in endangered rainforest monitoring. Cooperating with local organizations to improve nature reserves politics.',
  organizationName: person && person.organization,
  location: person && person.location,
  siteUrl: 'https://iuri.is/',
  avatarImage: person && person.avatarUrl,
  backgroundImage: person && person.backgroundUrl,
  ...overrides?.editFormValues,
}

export const useProfileCardProps = (): ProfileCardPropsOmited => {
  const { pkgs } = useContext(MainContext)
  const auth = useContext(AuthCtx)
  const [errMsg, setErrMsg] = useState('')
  const [profile, setProfile] = useState(profileDefault)
  const userAuth = auth.clientSessionData
  const [profileApi] = pkgs

  // const createProfile = async (data: ProfileFormValues) => {
  const editProfile = async (data: ProfileFormValues) => {
    const res: any = await profileApi.call('createProfile')({
      displayName: data.displayName,
      userId: userAuth?.user.id || 'nouserId',
    })
    !(res as RespCall).success && setErrMsg(res.msg)
  }

  // idprofile, metto come fisso

  /* const getProfile = async (userId: string) => {
    const res: any = await profileApi.call('getProfile')({ userId })
    (res as RespCall).success ? setProfile() && setErrMsg(res.msg)
  } */

  useEffect(() => {
    const userId = userAuth?.user.id
    if (!userId) return
    profileApi
      .call('getProfile')({ userId })
      .then(_profile => setProfile(_profile))
  }, [profileApi, userAuth?.user.id])

  const form = useFormik<ProfileFormValues>({
    onSubmit: editProfile,
    validationSchema,
    initialValues: profile,
  })

  const profileCardsProps: ProfileCardPropsOmited = {
    isOwner: false,
    isAuthenticated: false,
    // profileUrl: '396qamf8hfol-albert',
    // userId: '@396qamf8hfol-alberto@moodle.net',
    // setShowUserIdCopiedAlert: action('SetShowUserIdCopiedAlert'),
    // setShowUrlCopiedAlert: action('setShowUrlCopiedAlert'),
    // setIsReporting: action('setIsReporting'),
    // approveUserForm: useFormik({
    //   initialValues: {},
    //   onSubmit: action('approve User'),
    // }),
    // profileUrl: 'profile.url',
    // unapproveUserForm: useFormik({
    //   initialValues: {},
    //   onSubmit: action('unapprove User'),
    // }),
    // toggleFollowForm: useFormik({
    //   initialValues: {},
    //   onSubmit: action('toggle Follow'),
    // }),
    // requestApprovalForm: useFormik({
    //   initialValues: {},
    //   onSubmit: action('request Approval'),
    // }),
    // openSendMessage: action('open Send Message'),
    moreButtonItems: [],
    form,
    ...overrides?.props,
  }
  return profileCardsProps
}
