// import { t } from '@lingui/macro'
import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import { mixed, object, SchemaOf, string } from 'yup'
import { ResourceFormValues } from '../../../../common/types.mjs'
import { people } from '../../../helpers/factories.js'
import { fileExceedsMaxUploadSize, randomIntFromInterval } from '../../../helpers/utilities.js'
import { ResourceCardProps } from './ResourceCard.js'
// import { people } from '../../../../../helpers/factories'
// import { fileExceedsMaxUploadSize, people, randomIntFromInterval } from '@moodlenet/component-library/ui.mjs'

const maxUploadSize = 1024 * 1024 * 50
export const resourceStoriesValidationSchema: SchemaOf<ResourceFormValues> = object({
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

export const useResourceCardStoryProps = (overrides?: {
  editFormValues?: Partial<ResourceFormValues>
  props?: Partial<ResourceCardProps>
}): ResourceCardProps => {
  const person = people[randomIntFromInterval(0, 3)]
  return {
    isOwner: false,
    isAuthenticated: false,
    // resourceUrl: '396qamf8hfol-albert',
    // userId: '@396qamf8hfol-alberto@moodle.net',
    // setShowUserIdCopiedAlert: action('SetShowUserIdCopiedAlert'),
    // setShowUrlCopiedAlert: action('setShowUrlCopiedAlert'),
    // setIsReporting: action('setIsReporting'),
    // approveUserForm: useFormik({
    //   initialValues: {},
    //   onSubmit: action('approve User'),
    // }),
    // resourceUrl: 'resource.url',
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
    toggleIsEditing: action('toogle Is Editing'),
    // openSendMessage: action('open Send Message'),
    // moreButtonItems: [],
    form: useFormik<ResourceFormValues>({
      onSubmit: action('submit edit'),
      validationSchema: resourceStoriesValidationSchema,
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
    }),
    ...overrides?.props,
  }
}
