import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useFormik } from 'formik'
import { randomIntFromInterval } from '../../../../helpers/utilities'
import { href } from '../../../elements/link'
import {
  CollectionCardLoggedOutStoryProps,
  CollectionCardOwnerPrivateStoryProps,
  CollectionCardOwnerStoryProps,
  CollectionCardStoryProps,
} from '../../molecules/cards/CollectionCard/CollectionCard.stories'
import { OverallCardStoryProps } from '../../molecules/cards/OverallCard/OverallCard.stories'
import { useProfileCardStoryProps } from '../../molecules/cards/ProfileCard/stories-props'
import {
  ResourceCardLoggedInStoryProps,
  ResourceCardLoggedOutStoryProps,
  ResourceCardOwnerPrivateStoryProps,
  ResourceCardOwnerStoryProps,
} from '../../molecules/cards/ResourceCard/ResourceCard.stories'
import { HeaderLoggedOutStoryProps } from '../../organisms/Header/Header.stories'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { Profile, ProfileProps } from './Profile'
import { ProfileFormValues } from './types'

const meta: ComponentMeta<typeof Profile> = {
  title: 'Pages/Profile',
  component: Profile,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'useProfileStoryProps',
    'ProfileLoggedOutStoryProps',
    'ProfileLoggedInStoryProps',
    'ProfileOwnerStoryProps',
    'ProfileActivatedStoryProps',
    'ProfileAdminStoryProps',
    'ProfileApprovedStoryProps',
  ],
}

type ProfileStory = ComponentStory<typeof Profile>

export const useProfileStoryProps = (overrides?: {
  props?: Partial<ProfileProps>
  isAuthenticated?: boolean
  editFormValues?: Partial<ProfileFormValues>
}): ProfileProps => {
  const isAuthenticated = overrides?.isAuthenticated ?? true
  const ProfileCardStoryProps = useProfileCardStoryProps({
    props: { isAuthenticated },
    formValues: {
      ...overrides?.editFormValues,
      // avatarImage: null,
      // backgroundImage: null,
    },
  })

  return {
    form: ProfileCardStoryProps.form,
    sendEmailForm: useFormik<{ text: string }>({
      initialValues: { text: '' },
      onSubmit: action('submit send Email Form'),
    }),
    reportForm: useFormik<{ comment: string }>({
      initialValues: { comment: '' },
      onSubmit: action('submit report Form'),
    }),
    newResourceHref: href('Pages/New Resource/Default'),
    newCollectionHref: href('Pages/New Collection/Start'),
    headerPageTemplateProps: {
      headerPageProps: HeaderPageLoggedInStoryProps,
      isAuthenticated,
      mainPageWrapperProps: {
        userAcceptsPolicies: null,
        cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
      },
    },
    overallCardProps: OverallCardStoryProps,
    profileCardProps: ProfileCardStoryProps,
    collectionCardPropsList: [
      CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
      CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ],
    resourceCardPropsList: [
      ResourceCardLoggedInStoryProps,
      ResourceCardLoggedInStoryProps,
      ResourceCardLoggedInStoryProps,
    ],
    displayName: 'Juanito',
    ...overrides?.props,
  }
}

export const LoggedOut: ProfileStory = () => {
  const props = useProfileStoryProps({
    isAuthenticated: false,
    props: {
      headerPageTemplateProps: {
        isAuthenticated: false,
        headerPageProps: {
          // isAuthenticated: false,
          headerProps: {
            ...HeaderLoggedOutStoryProps,
            me: null,
          },
          // subHeaderProps: {
          //   tags: [],
          // },
        },
        mainPageWrapperProps: {
          userAcceptsPolicies: null,
          cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
        },
      },
      collectionCardPropsList: [
        CollectionCardLoggedOutStoryProps(
          randomIntFromInterval(0, 1) === 0 ? 0 : 1
        ),
        CollectionCardLoggedOutStoryProps(
          randomIntFromInterval(0, 1) === 0 ? 0 : 1
        ),
        CollectionCardLoggedOutStoryProps(
          randomIntFromInterval(0, 1) === 0 ? 0 : 1
        ),
      ],
      resourceCardPropsList: [
        ResourceCardLoggedOutStoryProps(
          randomIntFromInterval(0, 1) === 0 ? 0 : 1
        ),
        ResourceCardLoggedOutStoryProps(
          randomIntFromInterval(0, 1) === 0 ? 0 : 1
        ),
      ],
    },
  })

  return <Profile {...props} />
}

export const LoggedIn: ProfileStory = () => {
  const props = useProfileStoryProps({
    props: {
      profileCardProps: useProfileCardStoryProps({
        props: { isAuthenticated: true },
      }),
    },
  })
  return <Profile {...props} />
}

export const Owner: ProfileStory = () => {
  const props = useProfileStoryProps({
    props: {
      profileCardProps: useProfileCardStoryProps({ props: { isOwner: true } }),
      collectionCardPropsList: [
        CollectionCardOwnerPrivateStoryProps(
          randomIntFromInterval(0, 1) === 0 ? 0 : 1
        ),
        CollectionCardOwnerStoryProps(
          randomIntFromInterval(0, 1) === 0 ? 0 : 1
        ),
        CollectionCardOwnerStoryProps(
          randomIntFromInterval(0, 1) === 0 ? 0 : 1
        ),
        CollectionCardOwnerPrivateStoryProps(
          randomIntFromInterval(0, 1) === 0 ? 0 : 1
        ),
      ],
      resourceCardPropsList: [
        ResourceCardOwnerPrivateStoryProps,
        ResourceCardOwnerStoryProps,
        ResourceCardOwnerStoryProps,
        ResourceCardOwnerPrivateStoryProps,
        ResourceCardOwnerStoryProps,
      ],
    },
  })
  return <Profile {...props} />
}

export const Approved: ProfileStory = () => {
  const props = useProfileStoryProps({
    props: {
      profileCardProps: useProfileCardStoryProps({
        props: { isOwner: true, isApproved: true },
      }),
      collectionCardPropsList: [
        CollectionCardOwnerPrivateStoryProps(
          randomIntFromInterval(0, 1) === 0 ? 0 : 1
        ),
        CollectionCardOwnerStoryProps(
          randomIntFromInterval(0, 1) === 0 ? 0 : 1
        ),
        CollectionCardOwnerStoryProps(
          randomIntFromInterval(0, 1) === 0 ? 0 : 1
        ),
        CollectionCardOwnerPrivateStoryProps(
          randomIntFromInterval(0, 1) === 0 ? 0 : 1
        ),
      ],
      resourceCardPropsList: [
        ResourceCardOwnerPrivateStoryProps,
        ResourceCardOwnerStoryProps,
        ResourceCardOwnerStoryProps,
        ResourceCardOwnerPrivateStoryProps,
        ResourceCardOwnerStoryProps,
      ],
      showAccountApprovedSuccessAlert: true,
    },
  })
  return <Profile {...props} />
}

export const Activated: ProfileStory = () => {
  const props = useProfileStoryProps({
    editFormValues: {
      description: '',
      location: '',
      avatarImage: null,
      backgroundImage: null,
      organizationName: '',
      siteUrl: '',
    },
    props: {
      collectionCardPropsList: [],
      resourceCardPropsList: [],
      showAccountCreationSuccessAlert: true,
      profileCardProps: useProfileCardStoryProps({
        props: {
          isAuthenticated: true,
          isOwner: true,
        },
      }),
    },
  })
  return <Profile {...props} />
}

export const Admin: ProfileStory = () => {
  const props = useProfileStoryProps({
    props: {
      profileCardProps: useProfileCardStoryProps({
        props: {
          isAdmin: true,
          isAuthenticated: true,
          isApproved: false,
        },
      }),
      collectionCardPropsList: [],
      resourceCardPropsList: [],
      showAccountApprovedSuccessAlert: true,
    },
  })
  return <Profile {...props} />
}

export default meta
