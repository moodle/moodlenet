// import { t } from '@lingui/macro'
import { action, actions } from '@storybook/addon-actions'
import { profileFormValidationSchema } from '../../../../../common/profile/data.mjs'
import { ProfileFormValues } from '../../../../../common/types.mjs'
import { people } from '../../../helpers/factories.js'
import { randomIntFromInterval } from '../../../helpers/utilities.js'
import { ProfileCardProps } from './ProfileCard.js'
// import { people } from '../../../../../helpers/factories'
// import { fileExceedsMaxUploadSize, people, randomIntFromInterval } from '@moodlenet/component-library/ui.mjs'

const maxUploadSize = 1024 * 1024 * 50

export const useProfileCardStoryProps = (overrides?: {
  editFormValues?: Partial<ProfileFormValues>
  props?: Partial<ProfileCardProps>
}): ProfileCardProps => {
  const person = people[randomIntFromInterval(0, 3)]
  return {
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
    toggleIsEditing: action('toogle Is Editing'),
    // openSendMessage: action('open Send Message'),
    // moreButtonItems: [],
    formValues: {
      displayName: person ? person.title : '',
      aboutMe:
        'Italian biologist specialized in endangered rainforest monitoring. Cooperating with local organizations to improve nature reserves politics.',
      organizationName: person && person.organization,
      location: person && person.location,
      siteUrl: 'https://iuri.is/',
      avatarImage: person && person.avatarUrl,
      backgroundImage: person && person.backgroundUrl,
      ...overrides?.editFormValues,
    },
    validationSchema: profileFormValidationSchema(maxUploadSize),
    saveProfile: async () => actions('save profile'),
    ...overrides?.props,
  }
}
