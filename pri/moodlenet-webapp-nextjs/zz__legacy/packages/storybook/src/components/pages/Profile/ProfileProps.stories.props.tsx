import { peopleFactory, randomIntFromInterval } from '@moodlenet/component-library'
import { overrideDeep } from '@moodlenet/component-library/common'
import type { ProfileJiraRequestApprovalStateProps } from '@moodlenet/mn-central-jira-simple-moderations/ui'
import {
  JiraRequestApprovalButton,
  JiraRequestApprovalInfo,
  type JiraRequestApprovalInfoProps,
} from '@moodlenet/mn-central-jira-simple-moderations/ui'
import { href } from '@moodlenet/react-app/common'
import { OverallCardStories } from '@moodlenet/react-app/stories'
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
import type { PartialDeep } from 'type-fest'
import { MainLayoutLoggedInStoryProps } from '../../layout/MainLayout/MainLayout.stories'
import { getCollectionCardsStoryProps } from '../../organisms/CollectionCard/CollectionCardProps.stories.props'
import { getResourceCardsStoryProps } from '../../organisms/ResourceCard/ResourceCardProps.stories.props'

const maxUploadSize = 1024 * 1024 * 10
const pointsArray = [7, 50, 125, 321, 876, 3421, 12567, 43768, 67456, 345678]
const reportOptions = [
  { id: '1', name: 'Inappropriate behavior' },
  { id: '2', name: 'Impersonation' },
  { id: '3', name: 'Spamming' },
  { id: '4', name: 'Violation of terms of service' },
  { id: '5', name: 'Other' },
]

export const useProfileStoryProps = (
  overrides?: PartialDeep<
    ProfileProps & { jiraApprovalButton: ProfileJiraRequestApprovalStateProps }
  >,
): ProfileProps => {
  const person = peopleFactory[randomIntFromInterval(0, 3)]

  const data: ProfileData = {
    userId: (Math.random() * 1000000).toString(),
    displayName: person ? person.displayName : '',
    avatarUrl: person && person.avatarUrl,
    backgroundUrl: person && person.backgroundUrl,
    points: pointsArray[Math.floor(Math.random() * pointsArray.length)] ?? 0,
    ...overrides?.data,
    reportOptions: reportOptions,
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
    reportProfile: action('report profile'),
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

  const jiraRequestApprovalButton =
    access.isCreator && !access.isPublisher
      ? {
          Item: () => (
            <JiraRequestApprovalButton
              key="jira-approve-button"
              access={access}
              state={{
                isWaitingApproval: false,
                isElegibleForApproval: false,
                showApprovalRequestedSuccessAlert: false,
                minimumResourceAmount: 5,
                ...access,
                ...state,
                ...overrides?.jiraApprovalButton,
              }}
              actions={{ requestApproval: action('request approval'), ...actions }}
            />
          ),
          key: 'jira-approve-button',
        }
      : null

  const jiraApprovalInfoProps: JiraRequestApprovalInfoProps = {
    isWaitingApproval: false,
    isElegibleForApproval: false,
    showApprovalRequestedSuccessAlert: false,
    ...state,
    ...access,
    ...overrides?.jiraApprovalButton,
  }

  const jiraApprovalInfo =
    access.isCreator && !access.isPublisher
      ? {
          Item: () => (
            <JiraRequestApprovalInfo key="jira-request-approval-info" {...jiraApprovalInfoProps} />
          ),
          key: 'jira-request-approval-info',
        }
      : null

  const profileCardSlots: MainProfileCardSlots = {
    topItems: [],
    mainColumnItems: [jiraApprovalInfo],
    titleItems: [],
    subtitleItems: [],
    footerItems: [jiraRequestApprovalButton],
  }

  // const userProgressCardProps = {
  //   points: 10,
  // }

  return overrideDeep<ProfileProps>(
    {
      mainLayoutProps: MainLayoutLoggedInStoryProps,
      wideColumnItems: [],
      mainColumnItems: [],
      rightColumnItems: [],
      mainProfileCardSlots: profileCardSlots,
      profileForm: profileForm,
      state: state,
      actions: actions,
      data: data,
      access: access,
      validationSchemas: getValidationSchemas({ imageMaxUploadSize: maxUploadSize }),
      resourceCardPropsList: getResourceCardsStoryProps(
        5,
        {
          access: { ...access },
        },
        overrides?.access?.isAuthenticated,
      ),
      createResource: linkTo('Pages/Resource', 'New'),
      collectionCardPropsList: getCollectionCardsStoryProps(5, {
        access: { ...access },
      }),
      createCollection: linkTo('Pages/Collection', 'New'),
      overallCardItems: OverallCardStories.OverallCardStoryProps.items ?? [],
      // userProgressCardProps: userProgressCardProps,

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
