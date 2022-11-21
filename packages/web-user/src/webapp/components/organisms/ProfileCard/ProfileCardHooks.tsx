import { useContext, useState } from 'react'
import { AuthCtx } from '@moodlenet/react-app/web-lib'
import { useFormik } from 'formik'
import { ProfileCardProps } from './ProfileCard.js'
import { ProfileFormValues } from '../../../types.mjs'
import { fileExceedsMaxUploadSize, randomIntFromInterval } from '../../../helpers/utilities.js'
import { people } from '../../../helpers/factories.js'
import { mixed, object, SchemaOf, string } from 'yup'
import { MainContext } from '../../../MainContext.js'

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

export const useProfileCardProps = (): ProfileCardProps => {
  const { pkgs } = useContext(MainContext)
  const auth = useContext(AuthCtx)
  const [isEditing, setIsEditing] = useState(false)
  const userAuth = auth.clientSessionData
  const [profileApi] = pkgs

  const editProfile = async (data: ProfileFormValues) => {
    const res = await profileApi.call('editProfile')({
      displayName: data.displayName,
      userId: userAuth?.user.id || 'nouserId',
    })
    !res.success && setErrMsg(res.msg)
  }

  const form = useFormik<ProfileFormValues>({
    onSubmit: editProfile,
    validationSchema,
    initialValues: {
      displayName: person ? person.displayName : '',
      description:
        'Italian biologist specialized in endangered rainforest monitoring. Cooperating with local organizations to improve nature reserves politics.',
      organizationName: person && person.organization,
      location: person && person.location,
      siteUrl: 'https://iuri.is/',
      avatarImage: person && person.avatarUrl,
      backgroundImage: person && person.backgroundUrl,
      ...overrides?.editFormValues,
    },
  })

  const profileCardsProps: ProfileCardProps = {
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
    toggleIsEditing: () => setIsEditing(!isEditing),
    // openSendMessage: action('open Send Message'),
    moreButtonItems: [],
    form,
    ...overrides?.props,
  }
  return profileCardsProps
}
