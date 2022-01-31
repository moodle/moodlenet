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
import { useProfileCardStoryProps } from '../../molecules/cards/ProfileCard/props'
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
    editFormValues: overrides?.editFormValues,
  })

  return {
    editForm: ProfileCardStoryProps.editForm,
    sendEmailForm: useFormik<{ text: string }>({
      initialValues: { text: '' },
      onSubmit: action('submit send Email Form'),
    }),
    newResourceHref: href('Pages/New Resource/Start'),
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
    // scoreCardProps: ScoreCardStoryProps,
    collectionCardPropsList: [
      CollectionCardStoryProps(randomIntFromInterval(1, 3)),
      CollectionCardStoryProps(randomIntFromInterval(1, 3)),
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

export const ProfileLoggedOutStory: ProfileStory = () => {
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
        CollectionCardLoggedOutStoryProps(randomIntFromInterval(1, 3)),
        CollectionCardLoggedOutStoryProps(randomIntFromInterval(1, 3)),
        CollectionCardLoggedOutStoryProps(randomIntFromInterval(1, 3)),
      ],
      resourceCardPropsList: [
        ResourceCardLoggedOutStoryProps,
        ResourceCardLoggedOutStoryProps,
      ],
    },
  })

  return <Profile {...props} />
}

export const ProfileLoggedInStory: ProfileStory = () => {
  const props = useProfileStoryProps({
    props: {
      profileCardProps: useProfileCardStoryProps({
        props: { isAuthenticated: true },
      }),
    },
  })
  return <Profile {...props} />
}

export const ProfileOwnerStory: ProfileStory = () => {
  const props = useProfileStoryProps({
    props: {
      profileCardProps: useProfileCardStoryProps({ props: { isOwner: true } }),
      collectionCardPropsList: [
        CollectionCardOwnerPrivateStoryProps(randomIntFromInterval(1, 3)),
        CollectionCardOwnerStoryProps(randomIntFromInterval(1, 3)),
        CollectionCardOwnerStoryProps(randomIntFromInterval(1, 3)),
        CollectionCardOwnerPrivateStoryProps(randomIntFromInterval(1, 3)),
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

export const ProfileApprovedStory: ProfileStory = () => {
  const props = useProfileStoryProps({
    props: {
      profileCardProps: useProfileCardStoryProps({
        props: { isOwner: true, isApproved: true },
      }),
      collectionCardPropsList: [
        CollectionCardOwnerPrivateStoryProps(randomIntFromInterval(1, 3)),
        CollectionCardOwnerStoryProps(randomIntFromInterval(1, 3)),
        CollectionCardOwnerStoryProps(randomIntFromInterval(1, 3)),
        CollectionCardOwnerPrivateStoryProps(randomIntFromInterval(1, 3)),
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

export const ProfileActivatedStory: ProfileStory = () => {
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
    },
  })
  return <Profile {...props} />
}

export const ProfileAdminStory: ProfileStory = () => {
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
