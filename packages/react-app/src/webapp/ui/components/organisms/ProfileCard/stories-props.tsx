// import { t } from '@lingui/macro'
import { overrideDeep } from '@moodlenet/component-library/common'
import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import { PartialDeep } from 'type-fest'
import { mixed, object, SchemaOf, string } from 'yup'
import { ProfileFormValues } from '../../../../../common/types.mjs'
import { people } from '../../../helpers/factories.js'
import { fileExceedsMaxUploadSize, randomIntFromInterval } from '../../../helpers/utilities.js'
import { ProfileCardProps } from './ProfileCard.js'
// import { people } from '../../../../../helpers/factories'
// import { fileExceedsMaxUploadSize, people, randomIntFromInterval } from '@moodlenet/component-library/ui.mjs'

const maxUploadSize = 1024 * 1024 * 50
export const profileStoriesValidationSchema: SchemaOf<ProfileFormValues> = object({
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

export const useProfileCardStoryProps = (
  overrides?: PartialDeep<ProfileCardProps>,
): ProfileCardProps => {
  const person = people[randomIntFromInterval(0, 3)]
  return overrideDeep<ProfileCardProps>(
    {
      access: {
        isCreator: false,
        isAuthenticated: false,
      },
      actions: {
        toggleIsEditing: action('toogle Is Editing'),
      },
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
      // moreButtonItems: [],
      form: useFormik<ProfileFormValues>({
        onSubmit: action('submit edit'),
        validationSchema: profileStoriesValidationSchema,
        initialValues: {
          displayName: person ? person.title : '',
          aboutMe:
            'Italian biologist specialized in endangered rainforest monitoring. Cooperating with local organizations to improve nature reserves politics.',
          organizationName: person && person.organization,
          location: person && person.location,
          siteUrl: 'https://iuri.is/',
          avatarImage: person && person.avatarUrl,
          backgroundImage: person && person.backgroundUrl,
          ...overrides?.form,
        },
      }),
    },
    overrides,
  )
}
