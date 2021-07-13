import { ComponentMeta, ComponentStory } from '@storybook/react'
import { TrendCardStoryProps } from '../../components/cards/TrendCard/TrendCard.stories'
import { HeaderProps } from '../../components/Header/Header'
import { HeaderStoryProps } from '../../components/Header/Header.stories'
import { withPropsStatic } from '../../lib/ctrl'
import { HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import { HeaderPageProps } from '../HeaderPage/HeaderPage'
import { HeaderPageStoryProps } from '../HeaderPage/HeaderPage.stories'
import { Landing, LandingProps } from './Landing'

const meta: ComponentMeta<typeof Landing> = {
  title: 'Pages/Landing',
  component: Landing,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['LandingStoryProps', 'LandingLoggedOutStoryProps', 'LandingLoggedInStoryProps'],
}

const LandingStory: ComponentStory<typeof Landing> = args => <Landing {...args} />

export const LandingStoryProps: LandingProps = {
  withHeaderPageTemplateProps: withPropsStatic<HeaderPageTemplateProps>({
    withHeaderPageProps: withPropsStatic(HeaderPageStoryProps),
    isAuthenticated: true,
  }),
  withTrendCardProps: withPropsStatic(TrendCardStoryProps),
  organization: {
    name: 'Bern University of Applied Sciences',
    intro: 'Diverse, sound, dynamic – these are the values that define BFH. And this is our MoodleNet server. ',
  },
  image: 'https://picsum.photos/200/100',
}

export const LandingLoggedOutStoryProps: LandingProps = {
  ...LandingStoryProps,
  withHeaderPageTemplateProps: withPropsStatic<HeaderPageTemplateProps>({
    isAuthenticated: false,
    withHeaderPageProps: withPropsStatic<HeaderPageProps>({
      ...HeaderPageStoryProps,
      // isAuthenticated: false,
      withHeaderProps: withPropsStatic<HeaderProps>({
        ...HeaderStoryProps,
        me: null,
      }),
    }),
  }),
}

export const LandingLoggedInStoryProps: LandingProps = {
  ...LandingStoryProps,
  withHeaderPageTemplateProps: withPropsStatic<HeaderPageTemplateProps>({
    isAuthenticated: true,
    withHeaderPageProps: withPropsStatic<HeaderPageProps>({
      ...HeaderPageStoryProps,
      // isAuthenticated: true,
      withHeaderProps: withPropsStatic<HeaderProps>({
        ...HeaderStoryProps,
        me: { username: 'Juanito' },
      }),
    }),
  }),
}

export const LoggedOut = LandingStory.bind({})
LoggedOut.args = LandingLoggedOutStoryProps

export const LoggedIn = LandingStory.bind({})
LoggedIn.args = LandingLoggedInStoryProps

export default meta
