import { t } from '@lingui/macro'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { HeaderLoggedOutStoryProps } from '../../components/Header/Header.stories'
import { SubHeaderStoryProps } from '../../components/SubHeader/SubHeader.stories'
import { SBFormikBag } from '../../lib/storybook/SBFormikBag'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { CategoriesDropdown, FormatDropdown, LanguagesDropdown, LevelDropdown, LicenseDropdown, MonthDropdown, TypeDropdown, YearsDropdown } from '../NewResource/FieldsData'
import { NewResourceFormValues } from '../NewResource/types'
import { ContributorCardStoryProps } from './ContributorCard/ContributorCard.stories'
import { Resource, ResourceProps } from './Resource'
import { ResourceActionsCardStoryProps } from './ResourceActionsCard/ResourceActionsCard.stories'

const meta: ComponentMeta<typeof Resource> = {
  title: 'Pages/Resource',
  component: Resource,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['ResourceStoryProps', 'ResourceLoggedOutStoryProps', 'ResourceLoggedInStoryProps'],
}

const ResourceStory: ComponentStory<typeof Resource> = args => <Resource {...args} />

export const ResourceStoryProps: ResourceProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
  },
  isOwner: true,
  title: 'The Best Resource Ever',
  liked: false,
  tags: ["Reforestationg", "Drones", "Soil"],
  contributorCardProps: ContributorCardStoryProps,
  resourceActionsCard: ResourceActionsCardStoryProps,
  formBag: SBFormikBag<NewResourceFormValues>({
    addToCollections: [],
    category: '0215 Music and performing arts',
    content: '',
    contentType: 'Link',
    description: 'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
    format: 'Portal / main site',
    image: 'https://picsum.photos/200/100',
    language: 'Mexicano',
    level: '1 Primary education',
    license: 'CCO (Public domain)',
    name: '',
    originalDateMonth: 'August',
    originalDateYear: '2021',
    title: 'The Best Resource Ever',
    type: 'Web Site',
  }),
  types: TypeDropdown,
  levels: LevelDropdown,
  months: MonthDropdown,
  years: YearsDropdown,
  languages: LanguagesDropdown,
  formats: FormatDropdown,
  categories: CategoriesDropdown,
  licenses: {...LicenseDropdown, label: t`License`,}
}

export const ResourceLoggedOutStoryProps: ResourceProps = {
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
  },
}

export const ResourceLoggedInStoryProps: ResourceProps = {
  ...ResourceStoryProps,
  headerPageTemplateProps: {
    isAuthenticated: true,
    headerPageProps: {
      isAuthenticated: true,
      headerProps: HeaderLoggedOutStoryProps,
      subHeaderProps: SubHeaderStoryProps,
    },
  },
}

export const LoggedOut = ResourceStory.bind({})
LoggedOut.args = ResourceLoggedOutStoryProps

export const LoggedIn = ResourceStory.bind({})
LoggedIn.args = ResourceLoggedInStoryProps

export default meta
