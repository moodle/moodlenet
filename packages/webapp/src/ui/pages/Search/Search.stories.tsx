import { ComponentMeta, ComponentStory } from '@storybook/react'
import { FilterCardStoryProps } from '../../components/cards/FilterCard/FilterCard.stories'
import { ProfileCardStoryProps } from '../../components/cards/ProfileCard/ProfileCard.stories'
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

export const SearchStoryProps: SearchProps = {
  headerPageProps: HeaderPageStoryProps,
  profileCardProps: ProfileCardStoryProps,
  filterCardProps: FilterCardStoryProps,
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
