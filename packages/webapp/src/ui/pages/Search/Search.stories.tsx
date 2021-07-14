import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CollectionCardStoryProps } from '../../components/cards/CollectionCard/CollectionCard.stories'
import { FilterCardStoryProps } from '../../components/cards/FilterCard/FilterCard.stories'
import { ResourceCardStoryProps } from '../../components/cards/ResourceCard/ResourceCard.stories'
import { SubjectCardProps } from '../../components/cards/SubjectCard/SubjectCard'
import { SubjectCardStoryProps } from '../../components/cards/SubjectCard/SubjectCard.stories'
import { HeaderProps } from '../../components/Header/Header'
import { HeaderStoryProps } from '../../components/Header/Header.stories'
import { withPropsListStatic, withPropsStatic } from '../../lib/ctrl'
import { HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import { HeaderPageProps } from '../HeaderPage/HeaderPage'
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
  'Enviromental Science',
  'Sailing Principles',
  'NoShow',
].map(x => ({ organization: { ...SubjectCardStoryProps }.organization, title: x }))

export const SearchStoryProps: SearchProps = {
  headerPageTemplateWithProps: withPropsStatic<HeaderPageTemplateProps>({
    headerPageWithProps: withPropsStatic(HeaderPageStoryProps),
    isAuthenticated: true,
  }),
  filterCardProps: FilterCardStoryProps,
  subjectCardWithPropsList: withPropsListStatic(subjectCardPropsList),
  collectionCardWithPropsList: withPropsListStatic([CollectionCardStoryProps, CollectionCardStoryProps]),
  resourceCardWithPropsList: withPropsListStatic([
    ResourceCardStoryProps,
    ResourceCardStoryProps,
    ResourceCardStoryProps,
  ]),
}

export const SearchLoggedOutStoryProps: SearchProps = {
  ...SearchStoryProps,
  headerPageTemplateWithProps: withPropsStatic<HeaderPageTemplateProps>({
    isAuthenticated: false,
    headerPageWithProps: withPropsStatic<HeaderPageProps>({
      headerWithProps: withPropsStatic<HeaderProps>({
        ...HeaderStoryProps,
        me: null,
      }),
      subHeaderProps: null,
    }),
  }),
}

export const SearchLoggedInStoryProps: SearchProps = {
  ...SearchStoryProps,
  headerPageTemplateWithProps: withPropsStatic<HeaderPageTemplateProps>({
    isAuthenticated: false,
    headerPageWithProps: withPropsStatic<HeaderPageProps>({
      headerWithProps: withPropsStatic<HeaderProps>({
        ...HeaderStoryProps,
        me: { username: 'Juanito' },
      }),
      subHeaderProps: null,
    }),
  }),
}

export const LoggedOut = SearchStory.bind({})
LoggedOut.args = SearchLoggedOutStoryProps

export const LoggedIn = SearchStory.bind({})
LoggedIn.args = SearchLoggedInStoryProps

export default meta
