import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CollectionCardStoryProps } from '../../components/cards/CollectionCard/CollectionCard.stories'
import { ResourceCardStoryProps } from '../../components/cards/ResourceCard/ResourceCard.stories'
import { SubjectCardProps } from '../../components/cards/SubjectCard/SubjectCard'
import { SubjectCardStoryProps } from '../../components/cards/SubjectCard/SubjectCard.stories'
import { HeaderStoryProps } from '../../components/Header/Header.stories'
import { HeaderPageStoryProps } from '../HeaderPage/HeaderPage.stories'
import { Search, SearchProps } from './Search'

const meta: ComponentMeta<typeof Search> = {
  title: 'Pages/Search',
  component: Search,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['SearchStoryProps', 'SearchLoggedOutStoryProps', 'SearchLoggedInStoryProps'],
}

const SearchStory: ComponentStory<typeof Search> = args => <Search {...args} />

const subjectCardPropsList: SubjectCardProps[] = [
  '#Education',
  '#Forestry',
  'Enviromental Science with a lot of Mathematics and Physics',
  'Sailing Principles',
  'Latin',
  'Hebrew',
  'NoShow',
].map(x => ({ organization: { ...SubjectCardStoryProps }.organization, title: x }))

export const SearchStoryProps: SearchProps = {
  setSortBy: action(`set sort by`),
  headerPageTemplateProps: {
    headerPageProps: HeaderPageStoryProps,
    isAuthenticated: true,
  },
  subjectCardPropsList: subjectCardPropsList,
  collectionCardPropsList: [
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
  ],
  resourceCardPropsList: [ResourceCardStoryProps, ResourceCardStoryProps, ResourceCardStoryProps],
}

export const SearchLoggedOutStoryProps: SearchProps = {
  ...SearchStoryProps,
  headerPageTemplateProps: {
    isAuthenticated: false,
    headerPageProps: {
      headerProps: {
        ...HeaderStoryProps,
        me: null,
      },
      subHeaderProps: null,
    },
  },
}

export const SearchLoggedInStoryProps: SearchProps = {
  ...SearchStoryProps,
  headerPageTemplateProps: {
    isAuthenticated: false,
    headerPageProps: {
      headerProps: HeaderStoryProps,
      subHeaderProps: null,
    },
  },
}

export const LoggedOut = SearchStory.bind({})
LoggedOut.args = SearchLoggedOutStoryProps

export const LoggedIn = SearchStory.bind({})
LoggedIn.args = SearchLoggedInStoryProps

export default meta
