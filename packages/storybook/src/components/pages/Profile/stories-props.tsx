import { peopleFactory, randomIntFromInterval } from '@moodlenet/component-library'
import { overrideDeep } from '@moodlenet/component-library/common'
import { href } from '@moodlenet/react-app/common'
import { OverallCardStories } from '@moodlenet/react-app/stories'
import { OverallCard } from '@moodlenet/react-app/ui'
import {
  ProfileAccess,
  ProfileActions,
  ProfileData,
  profileFormValidationSchema,
  ProfileFormValues,
  ProfileState,
} from '@moodlenet/web-user/common'
import { MainProfileCardSlots, ProfileProps } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { getCollectionsCardStoryProps } from 'components/organisms/CollectionCard/story-props.js'
import { getResourcesCardStoryProps } from 'components/organisms/ResourceCard/story-props.js'
import { PartialDeep } from 'type-fest'
import { MainLayoutLoggedInStoryProps } from '../../layout/MainLayout/MainLayout.stories.js'

const maxUploadSize = 1024 * 1024 * 50

export const useProfileStoryProps = (overrides?: PartialDeep<ProfileProps>): ProfileProps => {
  const person = peopleFactory[randomIntFromInterval(0, 3)]

  const overallCard = {
    Item: () => <OverallCard {...OverallCardStories.OverallCardStoryProps} />,
    key: 'overall-card',
  }

  const profileCardSlots: MainProfileCardSlots = {
    topItems: [],
    mainColumnItems: [],
    titleItems: [],
    subtitleItems: [],
    footerItems: [],
  }

  const data: ProfileData = {
    userId: (Math.random() * 1000000).toString(),
    username: person ? person.displayName : 'username',
    avatarUrl: person && person.avatarUrl,
    backgroundUrl: person && person.backgroundUrl,
    profileHref: href('Page/Profile/Default'),
  }

  const state: ProfileState = {
    profileUrl: 'https://moodle.net/profile',

    followed: false,
    numFollowers: 13,
  }

  const actions: ProfileActions = {
    editProfile: action('editing profile'),
    sendMessage: action('send message'),
    toggleFollow: action('toggle follow'),
    setAvatar: action('set avatar image'),
    setBackground: action('set background image'),
  }

  const access: ProfileAccess = {
    isAuthenticated: true,
    canEdit: false,
    isCreator: false,
    isAdmin: false,
    canFollow: true,
    ...overrides?.access,
  }

  console.log('access', access)

  const profileForm: ProfileFormValues = {
    displayName: person ? person.displayName : '',
    aboutMe:
      'Italian biologist specialized in endangered rainforest monitoring. Cooperating with local organizations to improve nature reserves politics.',
    organizationName: person && person.organization,
    location: person && person.location,
    siteUrl: 'https://iuri.is/',
  }

  return overrideDeep<ProfileProps>(
    {
      mainLayoutProps: MainLayoutLoggedInStoryProps,
      mainColumnItems: [],
      sideColumnItems: [overallCard],
      mainProfileCardSlots: profileCardSlots,
      profileForm: profileForm,
      state: state,
      actions: actions,
      data: data,
      access: access,
      validationSchema: profileFormValidationSchema(maxUploadSize),
      resourceCardPropsList: getResourcesCardStoryProps(5, {
        access: { ...access },
      }),
      createResource: linkTo('Pages/New Resource/Default'),
      collectionCardPropsList: getCollectionsCardStoryProps(5, {
        access: { canPublish: false },
      }),
      createCollection: linkTo('Pages/New Collection/Default'),
      overallCardItems: OverallCardStories.OverallCardStoryProps.items ?? [],

      // editForm: ProfileCardStoryProps.editForm,
      // sendEmailForm: useFormik<{ text: string }>({
      //   initialValues: { text: '' },
      //   onSubmit: action('submit send Email Form'),
      // }),
      // reportForm: useFormik<{ comment: string }>({
      //   initialValues: { comment: '' },
      //   onSubmit: action('submit report Form'),
      // }),
      // newResourceHref: href('Pages/New Resource/Default'),
      // newCollectionHref: href('Pages/New Collection/Start'),
      // headerPageTemplateProps: {
      //   headerPageProps: HeaderPageLoggedInStoryProps,
      //   isAuthenticated,
      //   mainPageWrapperProps: {
      //     userAcceptsPolicies: null,
      //     cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
      //   },
      // },
      // overallCardProps: OverallCardStoryProps,
      // collectionCardPropsList: [
      //   CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
      //   CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
      // ],
      // resourceCardPropsList: [
      //   ResourceCardLoggedInStoryProps,
      //   ResourceCardLoggedInStoryProps,
      //   ResourceCardLoggedInStoryProps,
      // ],
    },
    { ...overrides },
  )
}
