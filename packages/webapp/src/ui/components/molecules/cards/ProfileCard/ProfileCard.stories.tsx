import { t } from '@lingui/macro'
import { action } from '@storybook/addon-actions'
import { ComponentMeta } from '@storybook/react'
import { useFormik } from 'formik'
import { mixed, object, SchemaOf, string } from 'yup'
import { people } from '../../../../../helpers/factories'
import { randomIntFromInterval } from '../../../../../helpers/utilities'
import { ProfileFormValues } from '../../../pages/Profile/types'
import { ProfileCard, ProfileCardProps } from './ProfileCard'

const meta: ComponentMeta<typeof ProfileCard> = {
  title: 'Molecules/ProfileCard',
  component: ProfileCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['useProfileCardStoryProps'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 500 }}>
        <Story />
      </div>
    ),
  ],
}

export const validationSchema: SchemaOf<ProfileFormValues> = object({
  avatarImage: mixed().optional(),
  backgroundImage: mixed().optional(),
  displayName: string().required(t`Please provide a display name`),
  location: string().optional(),
  organizationName: string().optional(),
  siteUrl: string().url().optional(),
  description: string().required(t`Please provide a Description`),
})
export const useProfileCardStoryProps = (overrides?: {
  editFormValues?: Partial<ProfileFormValues>
  props?: Partial<ProfileCardProps>
}): ProfileCardProps => {
  const person = people[randomIntFromInterval(0, 3)]
  return {
    isOwner: false,
    isAuthenticated: false,
    approveUserForm: useFormik({
      initialValues: {},
      onSubmit: action('approve User'),
    }),
    unapproveUserForm: useFormik({
      initialValues: {},
      onSubmit: action('unapprove User'),
    }),
    toggleFollowForm: useFormik({
      initialValues: {},
      onSubmit: action('toggle Follow'),
    }),
    requestApprovalForm: useFormik({
      initialValues: {},
      onSubmit: action('request Approval'),
    }),
    toggleIsEditing: action('toogle Is Editing'),
    openSendMessage: action('open Send Message'),
    editForm: useFormik<ProfileFormValues>({
      onSubmit: action('submit edit'),
      validationSchema,
      initialValues: {
        displayName: person?.username!,
        description:
          'Italian biologist specialized in endangered rainforest monitoring. Cooperating with local organizations to improve nature reserves politics.',
        organizationName: person?.organization!,
        location: person?.location!,
        siteUrl: 'https://iuri.is/',
        avatarImage: null,
        backgroundImage: null,
        ...overrides?.editFormValues,
      },
    }),
    ...overrides?.props,
  }
}

export const LoggedOut = () => {
  const props = useProfileCardStoryProps()
  return <ProfileCard {...props} />
}

export const LoggedIn = () => {
  const props = useProfileCardStoryProps({
    props: {
      isAuthenticated: true,
    },
  })
  return <ProfileCard {...props} />
}

export const Owner = () => {
  const props = useProfileCardStoryProps({
    props: {
      showAccountApprovedSuccessAlert: true,
      isApproved: true,
    },
  })
  return <ProfileCard {...props} />
}
export const Approved = () => {
  const props = useProfileCardStoryProps({
    props: {
      isOwner: true,
      isElegibleForApproval: true,
      showAccountApprovedSuccessAlert: true,
      isApproved: true,
    },
  })
  return <ProfileCard {...props} />
}

export const Admin = () => {
  const props = useProfileCardStoryProps({
    props: {
      isAuthenticated: true,
      isAdmin: true,
    },
  })
  return <ProfileCard {...props} />
}

export default meta
