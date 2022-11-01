// import { t } from '@lingui/macro'
import { action } from '@storybook/addon-actions'
import { mixed, object, SchemaOf, string } from 'yup'
import { people } from '../../../helpers/factories.js'
import { fileExceedsMaxUploadSize, randomIntFromInterval } from '../../../helpers/utilities.js'
import { ProfileFormValues } from '../../../types.mjs'
import { ProfileCardProps } from './ProfileCard.js'
// import { people } from '../../../../../helpers/factories'
// import { fileExceedsMaxUploadSize, people, randomIntFromInterval } from '@moodlenet/component-library/ui.mjs'

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

export const getProfileCardStoryProps = (overrides?: {
  editFormValues?: Partial<ProfileFormValues>
  props?: Partial<ProfileCardProps>
}): ProfileCardProps => {
  const person = people[randomIntFromInterval(0, 3)]
  return {
    displayName: person?.displayName ?? '',
    description:
      'Rainforest ecosystems advisor. Providing support on the foundation of new nature reserves and protected areas.',
    location: 'Australia',
    siteUrl: 'https://iuri.is/',
    avatarUrl: person?.avatarUrl,
    backgroundUrl: person?.backgroundUrl,
    isAuthenticated: false,
    isOwner: false,
    userId: '@396qamf8hfol-Bru-Mas-Ribera@moodle.net',
    contentItems: [],
    bottomItems: [],
    subtitleItems: [],

    profileUrl: 'profile.url',
    setShowUserIdCopiedAlert: action('SetShowUserIdCopiedAlert'),
    setShowUrlCopiedAlert: action('setShowUrlCopiedAlert'),
    toggleIsEditing: action('toggle Is Editing'),
    setIsReporting: action('setIsReporting'),
    // approveUserForm: useFormik({
    //   initialValues: {},
    //   onSubmit: action('approve User'),
    // }),
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
    openSendMessage: action('Open Send Message'),
    // editForm: useFormik<ProfileFormValues>({
    //   onSubmit: action('submit edit'),
    //   validationSchema,
    //   initialValues: {
    //     displayName: person!.displayName,
    //     description:
    //       'Italian biologist specialized in endangered rainforest monitoring. Cooperating with local organizations to improve nature reserves politics.',
    //     organizationName: person!.organization,
    //     location: person!.location,
    //     siteUrl: 'https://iuri.is/',
    //     avatarImage: person!.avatarUrl,
    //     backgroundImage: person!.backgroundUrl,
    //     ...overrides?.editFormValues,
    //   },
    // }),
    ...overrides?.props,
  }
}
