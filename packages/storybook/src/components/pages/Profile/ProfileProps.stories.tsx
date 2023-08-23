import { peopleFactory, randomIntFromInterval } from '@moodlenet/component-library'
import { overrideDeep } from '@moodlenet/component-library/common'
import { JiraApproveButton } from '@moodlenet/mn-central-jira-simple-moderations/ui'
import { href } from '@moodlenet/react-app/common'
import { OverallCardStories } from '@moodlenet/react-app/stories'
import { OverallCard } from '@moodlenet/react-app/ui'
import type {
  ProfileAccess,
  ProfileActions,
  ProfileData,
  ProfileFormValues,
  ProfileState,
} from '@moodlenet/web-user/common'
import { getValidationSchemas } from '@moodlenet/web-user/common'
import type { MainProfileCardSlots, ProfileProps } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { getCollectionCardsStoryProps } from 'components/organisms/CollectionCard/CollectionCardProps.stories.js'
import { getResourceCardsStoryProps } from 'components/organisms/ResourceCard/ResourceCardProps.stories.js'
import type { PartialDeep } from 'type-fest'
import { MainLayoutLoggedInStoryProps } from '../../layout/MainLayout/MainLayout.stories.js'

const maxUploadSize = 1024 * 1024 * 0.001

export const useProfileStoryProps = (overrides?: PartialDeep<ProfileProps>): ProfileProps => {
  const person = peopleFactory[randomIntFromInterval(0, 3)]

  const overallCard = {
    Item: () => <OverallCard {...OverallCardStories.OverallCardStoryProps} />,
    key: 'overall-card',
  }

  const data: ProfileData = {
    userId: (Math.random() * 1000000).toString(),
    displayName: person ? person.displayName : '',
    avatarUrl: person && person.avatarUrl,
    backgroundUrl: person && person.backgroundUrl,
    profileHref: href('Page/Profile/Default'),
  }

  const state: ProfileState = {
    profileUrl: 'https://moodle.net/profile',
    followed: false,
    numFollowers: 13,
    isPublisher: true,
    showAccountApprovedSuccessAlert: false,
    // isWaitingApproval: false,
    // isElegibleForApproval: false,
    // showApprovalRequestedSuccessAlert: false,
  }

  const actions: ProfileActions = {
    editProfile: action('editing profile'),
    sendMessage: action('send message'),
    toggleFollow: action('toggle follow'),
    setAvatar: action('set avatar image'),
    setBackground: action('set background image'),
    approveUser: action('approve user'),
    unapproveUser: action('unapprove user'),
    // requestApproval: action('request approval'),
  }

  const access: ProfileAccess = {
    isAuthenticated: true,
    canEdit: false,
    isCreator: false,
    isPublisher: true,
    isAdmin: false,
    canFollow: true,
    canApprove: false,
    ...overrides?.access,
  }

  const profileForm: ProfileFormValues = {
    displayName: person ? person.displayName : '',
    aboutMe:
      'Italian biologist specialized in endangered rainforest monitoring. Cooperating with local organizations to improve nature reserves politics.',
    organizationName: person && person.organization,
    location: person && person.location,
    siteUrl: 'https://iuri.is/',
  }

  const profileCardSlots: MainProfileCardSlots = {
    topItems: [],
    mainColumnItems: [],
    titleItems: [],
    subtitleItems: [],
    footerItems: [
      {
        Item: () => (
          <JiraApproveButton
            key="jira-approve-button"
            access={access}
            state={{
              isWaitingApproval: false,
              isElegibleForApproval: false,
              showApprovalRequestedSuccessAlert: false,
              ...state,
            }}
            actions={{ requestApproval: action('request approval'), ...actions }}
          />
        ),
        key: 'jira-approve-button',
      },
    ],
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
      validationSchemas: getValidationSchemas({ imageMaxUploadSize: maxUploadSize }),
      resourceCardPropsList: getResourceCardsStoryProps(5, {
        access: { ...access },
      }),
      createResource: linkTo('Pages/New Resource/Default'),
      collectionCardPropsList: getCollectionCardsStoryProps(5, {
        access: { ...access },
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
