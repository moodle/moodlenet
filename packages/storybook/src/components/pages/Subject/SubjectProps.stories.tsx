import { overrideDeep } from '@moodlenet/component-library/common'
import type { MainSubjectCardSlots, SubjectOverallProps, SubjectProps } from '@moodlenet/ed-meta/ui'
import { Subject } from '@moodlenet/ed-meta/ui'
import type { SimpleResourceListProps } from '@moodlenet/ed-resource/ui'
import { SimpleResourceList } from '@moodlenet/ed-resource/ui'
import type { BookmarkButtonProps, FollowButtonProps } from '@moodlenet/web-user/ui'
import { FollowButton } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import type { ComponentMeta } from '@storybook/react'
import { getResourceCardsStoryProps } from 'components/organisms/ResourceCard/ResourceCardProps.stories.js'
import type { PartialDeep } from 'type-fest'
import {
  MainLayoutLoggedInStoryProps,
  MainLayoutLoggedOutStoryProps,
} from '../../layout/MainLayout/MainLayout.stories.js'

const meta: ComponentMeta<typeof Subject> = {
  title: 'Pages/Subject',
  component: Subject,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'SubjectFormProps',
    'SubjectStoryProps',
    'subjectFormBag',
    'SubjectStoryProps',
    'SubjectLinkLoggedOutStoryProps',
    'SubjectFileLoggedOutStoryProps',
    'SubjectLoggedInStoryProps',
    'SubjectOwnerStoryProps',
    'SubjectAdminStoryProps',
    'validationSchema',
    'SubjectTextOptionProps',
    'useSubjectForm',
    'useSubjectStoryProps',
    'subjectFormProps',
    'useMainSubjectCardStoryProps',
  ],
}

export const useSubjectStoryProps = (
  overrides?: PartialDeep<
    SubjectProps & {
      isAuthenticated: boolean
      bookmarkButtonProps: BookmarkButtonProps
      followButtonProps: FollowButtonProps
    }
  >,
): SubjectProps => {
  const isAuthenticated = overrides?.isAuthenticated ?? true

  const followButtonProps: FollowButtonProps = {
    canFollow: true,
    followed: false,
    isCreator: false,
    toggleFollow: action('toggleFollow'),
    ...overrides?.followButtonProps,
    isAuthenticated,
  }

  const mainSubjectCardSlots: MainSubjectCardSlots = {
    mainColumnItems: [],
    headerItems: [],
    footerRowItems: [
      {
        Item: () => <FollowButton {...followButtonProps} key="follow-button" />,
        key: 'follow-button',
      },
    ],
  }

  // const resourceCardPropsList: { props: ProxyProps<ResourceCardProps>; key: string }[] =
  //   overrides?.resourceCardPropsList?.length === 0
  //     ? []
  //     : getResourceCardsStoryProps(6, {
  //         access: {
  //           ...access,
  //           ...accessOverrides,
  //         },
  //         orientation: 'horizontal',
  //       })

  const overallItems: SubjectOverallProps[] = [
    {
      name: 'Followers',
      value: 13,
      key: 'followers',
    },
    // {
    //   name: 'Collections',
    //   value: 31,
    //   key: 'collections',
    // },
    {
      name: 'Resources',
      value: 92,
      key: 'resources',
    },
  ]

  const resourceList: SimpleResourceListProps = {
    title: 'Resources',
    resourceCardPropsList: getResourceCardsStoryProps(6, {
      access: {},
      orientation: 'horizontal',
    }),
  }

  return overrideDeep<SubjectProps>(
    {
      mainLayoutProps: isAuthenticated
        ? MainLayoutLoggedInStoryProps
        : MainLayoutLoggedOutStoryProps,

      mainSubjectCardSlots: mainSubjectCardSlots,
      mainColumnItems: [
        { Item: () => <SimpleResourceList {...resourceList} />, key: 'resource-list' },
      ],

      title: 'Engineering, manufacturing and construction',
      overallItems: overallItems,
      isIsced: true,
      iscedUrl:
        'http://uis.unesco.org/en/topic/international-standard-classification-education-isced',
    },
    { ...overrides },
  )
}

// const headerPageTemplatePropsUnauth: HeaderPageTemplateProps = {
//   isAuthenticated: false,
//   headerPageProps: {
//     headerProps: {
//       ...HeaderLoggedOutStoryProps,
//       me: null,
//     },
//   },
//   mainPageWrapperProps: {
//     userAcceptsPolicies: null,
//     cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
//   },
// }
// export const LinkLoggedOut = () => {
//   const props = SubjectStoryProps({
//     props: {
//       headerPageTemplateProps: headerPageTemplatePropsUnauth,
//       isAuthenticated: false,
//     },
//   })

//   return <Subject {...props} />
// }

// export const FileLoggedOut = () => {
//   const props = SubjectStoryProps({
//     props: {
//       headerPageTemplateProps: headerPageTemplatePropsUnauth,
//       isAuthenticated: false,
//       contentType: 'file',
//       contentUrl: 'https://picsum.photos/200/100',
//       subjectFormat: 'Video',
//     },
//   })
//   return <Subject {...props} />
// }

export default meta
