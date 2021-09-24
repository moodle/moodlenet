import { t } from '@lingui/macro'
import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { HeaderLoggedOutStoryProps } from '../../components/molecules/Header/Header.stories'
import { href } from '../../elements/link'
import { TagListStory } from '../../elements/tags'
import { SBFormikBag } from '../../lib/storybook/SBFormikBag'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import {
  CategoriesDropdown,
  LanguagesDropdown,
  LevelDropdown,
  LicenseDropdown,
  MonthDropdown,
  TypeDropdown,
  YearsDropdown
} from '../NewResource/FieldsData'
import { NewResourceFormValues } from '../NewResource/types'
import { ContributorCardStoryProps } from './ContributorCard/ContributorCard.stories'
import { Resource, ResourceProps } from './Resource'

const meta: ComponentMeta<typeof Resource> = {
  title: 'Pages/Resource',
  component: Resource,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'resourceFormBag',
    'ResourceStoryProps',
    'ResourceLinkLoggedOutStoryProps',
    'ResourceFileLoggedOutStoryProps',
    'ResourceLoggedInStoryProps',
    'ResourceOwnerStoryProps',
  ],
}

const ResourceStory: ComponentStory<typeof Resource> = args => <Resource {...args} />

export const resourceFormBag: NewResourceFormValues = {
  collections: ['Biology'].map(label => ({ label, id: label })),
  category: '0188 Inter-disciplinary programmes and qualifications involving education',
  content: '',
  contentType: 'Link',
  description:
    'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
  format: 'Portal / main site',
  image: 'https://picsum.photos/200/100',
  imageUrl: 'https://picsum.photos/200/100',
  language: 'Spanish',
  level: '1 Primary education',
  license: 'CCO (Public domain)',
  name: '',
  originalDateMonth: 'September',
  originalDateYear: '2021',
  title: 'The Best Resource Ever',
  type: 'Web Site',
}

export const ResourceStoryProps: ResourceProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  },
  isAuthenticated: true,
  isOwner: false,
  title: 'The Best Resource Ever',
  liked: false,
  numLikes: 23,
  bookmarked: true,
  tags: TagListStory,
  contributorCardProps: ContributorCardStoryProps,
  formBag: SBFormikBag<NewResourceFormValues>(resourceFormBag),
  contentUrl: '#',
  type: 'link',
  collections: [
    'Education',
    'Biology',
    'Algebra',
    'Phycology',
    'Phylosophy',
    'Sociology',
    'English Literature',
  ].map(label => ({ label, id: label })),
  selectedCollections: [{ label: 'Education', id: 'Education' }],
  types: TypeDropdown,
  levels: LevelDropdown,
  months: MonthDropdown,
  years: YearsDropdown,
  languages: LanguagesDropdown,
  // formats: FormatDropdown,
  categories: CategoriesDropdown,
  licenses: { ...LicenseDropdown, label: t`License` },
  updateResource: action('updateResource'),
  toggleLike: action('toggleLike'),
  toggleBookmark: action('toggleBookmark'),
  setAddToCollections: action('setAddToCollection'),
  sendToMoodleLms: action('Send to Moodle LMS'),
  deleteResource: action('Delete Resource'),
}

export const ResourceLinkLoggedOutStoryProps: ResourceProps = {
  ...ResourceStoryProps,
  headerPageTemplateProps: {
    isAuthenticated: false,
    headerPageProps: {
      isAuthenticated: false,
      headerProps: {
        ...HeaderLoggedOutStoryProps,
        me: null,
      },
      subHeaderProps: {
        tags: [],
      },
    },
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  },
  isAuthenticated: false,
}

export const ResourceFileLoggedOutStoryProps: ResourceProps = {
  ...ResourceLinkLoggedOutStoryProps,
  type: 'file',
  formBag: SBFormikBag<NewResourceFormValues>({ ...resourceFormBag, contentType: 'File', type: 'Video' }),
}

export const ResourceLoggedInStoryProps: ResourceProps = {
  ...ResourceStoryProps,
}

export const ResourceOwnerStoryProps: ResourceProps = {
  ...ResourceStoryProps,
  isOwner: true,
}

export const LinkLoggedOut = ResourceStory.bind({})
LinkLoggedOut.args = ResourceLinkLoggedOutStoryProps

export const FileLoggedOut = ResourceStory.bind({})
FileLoggedOut.args = ResourceFileLoggedOutStoryProps

export const LoggedIn = ResourceStory.bind({})
LoggedIn.args = ResourceLoggedInStoryProps

export const Owner = ResourceStory.bind({})
Owner.args = ResourceOwnerStoryProps

export default meta
