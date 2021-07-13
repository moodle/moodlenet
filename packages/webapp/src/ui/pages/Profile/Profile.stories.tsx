import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CollectionCardStoryProps } from '../../components/cards/CollectionCard/CollectionCard.stories'
import { OverallCardStoryProps } from '../../components/cards/OverallCard/OverallCard.stories'
import { ProfileCardStoryProps } from '../../components/cards/ProfileCard/ProfileCard.stories'
import { ResourceCardStoryProps } from '../../components/cards/ResourceCard/ResourceCard.stories'
import { ScoreCardStoryProps } from '../../components/cards/ScoreCard/ScoreCard.stories'
import { HeaderProps } from '../../components/Header/Header'
import { HeaderStoryProps } from '../../components/Header/Header.stories'
import { SubHeaderStoryProps } from '../../components/SubHeader/SubHeader.stories'
import { withPropsListStatic, withPropsStatic } from '../../lib/ctrl'
import { HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import { HeaderPageProps } from '../HeaderPage/HeaderPage'
import { HeaderPageStoryProps } from '../HeaderPage/HeaderPage.stories'
import { Profile, ProfileProps } from './Profile'

const meta: ComponentMeta<typeof Profile> = {
  title: 'Pages/Profile',
  component: Profile,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['ProfileStoryProps', 'ProfileLoggedOutStoryProps', 'ProfileLoggedInStoryProps'],
}

const ProfileStory: ComponentStory<typeof Profile> = args => <Profile {...args} />

export const ProfileStoryProps: ProfileProps = {
  withHeaderPageTemplateProps: withPropsStatic<HeaderPageTemplateProps>({
    withHeaderPageProps: withPropsStatic(HeaderPageStoryProps),
    isAuthenticated: true,
  }),
  overallCardProps: OverallCardStoryProps,
  profileCardProps: ProfileCardStoryProps,
  scoreCardProps: ScoreCardStoryProps,
  withCollectionCardPropsList: withPropsListStatic([CollectionCardStoryProps, CollectionCardStoryProps]),
  withResourceCardPropsList: withPropsListStatic([ResourceCardStoryProps]),
  username: 'Juanito',
}

export const ProfileLoggedOutStoryProps: ProfileProps = {
  ...ProfileStoryProps,
  withHeaderPageTemplateProps: withPropsStatic<HeaderPageTemplateProps>({
    isAuthenticated: false,
    withHeaderPageProps: withPropsStatic<HeaderPageProps>({
      // isAuthenticated: false,
      withHeaderProps: withPropsStatic<HeaderProps>({
        ...HeaderStoryProps,
        me: null,
      }),
      withSubHeaderProps: withPropsStatic(SubHeaderStoryProps),
    }),
  }),
}

export const ProfileLoggedInStoryProps: ProfileProps = {
  ...ProfileStoryProps,
  withHeaderPageTemplateProps: withPropsStatic<HeaderPageTemplateProps>({
    ...HeaderPageStoryProps,
    isAuthenticated: true,
    withHeaderPageProps: withPropsStatic<HeaderPageProps>({
      // isAuthenticated: true,
      withHeaderProps: withPropsStatic<HeaderProps>({
        ...HeaderStoryProps,
        me: { username: 'Juanito' },
      }),
      withSubHeaderProps: withPropsStatic(SubHeaderStoryProps),
    }),
  }),
}

export const LoggedOut = ProfileStory.bind({})
LoggedOut.args = ProfileLoggedOutStoryProps

export const LoggedIn = ProfileStory.bind({})
LoggedIn.args = ProfileLoggedInStoryProps

export default meta
