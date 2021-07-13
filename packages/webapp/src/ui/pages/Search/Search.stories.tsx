import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CollectionCardStoryProps } from '../../components/cards/CollectionCard/CollectionCard.stories'
import { FilterCardStoryProps } from '../../components/cards/FilterCard/FilterCard.stories'
import { ResourceCardStoryProps } from '../../components/cards/ResourceCard/ResourceCard.stories'
import { SubjectCardProps } from '../../components/cards/SubjectCard/SubjectCard'
import { SubjectCardStoryProps } from '../../components/cards/SubjectCard/SubjectCard.stories'
import { HeaderStoryProps } from '../../components/Header/Header.stories'
import { HeaderPageStoryProps } from '../HeaderPage/HeaderPage.stories'
import { Search, SearchProps as SearchProps } from './Search'

const meta: ComponentMeta<typeof Search> = {
  title: 'Pages/Search',
  component: Search,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: {layout: 'fullscreen'},
  excludeStories: ['SearchStoryProps', 'SearchLoggedOutStoryProps', 'SearchLoggedInStoryProps'],
}

const SearchStory: ComponentStory<typeof Search> = args => <Search {...args} />

const subjectCardPropsList: SubjectCardProps[] = ['#Education', '#Forestry', 'Enviromental Science', 'Sailing Principles', 'NoShow'].map((x)=>(
  {organization: {...SubjectCardStoryProps}.organization,
   title: x}
))

export const SearchStoryProps: SearchProps = {
  headerPageProps: HeaderPageStoryProps,
  filterCardProps: FilterCardStoryProps,
  subjectCardPropsList: subjectCardPropsList,
  collectionCardPropsList: [CollectionCardStoryProps, CollectionCardStoryProps],
  resourceCardPropsList: [ResourceCardStoryProps, ResourceCardStoryProps, ResourceCardStoryProps]
}

export const SearchLoggedOutStoryProps: SearchProps = {
  ...SearchStoryProps, 
  headerPageProps: {
    ...HeaderPageStoryProps, 
    headerProps: {
      ...HeaderStoryProps, 
      me: null
    }
  }
}

export const SearchLoggedInStoryProps: SearchProps = {
  ...SearchStoryProps, 
  headerPageProps: {
    ...HeaderPageStoryProps, 
    headerProps: {
      ...HeaderStoryProps, 
      me: {username: 'Juanito'}
    }
  }
}

export const LoggedOut = SearchStory.bind({})
LoggedOut.args = SearchLoggedOutStoryProps

export const LoggedIn = SearchStory.bind({})
LoggedIn.args = SearchLoggedInStoryProps

export default meta
