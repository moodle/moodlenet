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
  headerPageTemplateWithProps: withPropsStatic<HeaderPageTemplateProps>({
    headerPageWithProps: withPropsStatic(HeaderPageStoryProps),
    isAuthenticated: true,
  }),
  trendCardWithProps: withPropsStatic(TrendCardStoryProps),
  organization: {
    name: 'Bern University of Applied Sciences',
    intro: 'Diverse, sound, dynamic – these are the values that define BFH. And this is our MoodleNet server. ',
  },
  image: 'https://picsum.photos/200/100',
}

export const LandingLoggedOutStoryProps: LandingProps = {
  ...LandingStoryProps,
  headerPageTemplateWithProps: withPropsStatic<HeaderPageTemplateProps>({
    isAuthenticated: false,
    headerPageWithProps: withPropsStatic<HeaderPageProps>({
      ...HeaderPageStoryProps,
      // isAuthenticated: false,
      headerWithProps: withPropsStatic<HeaderProps>({
        ...HeaderStoryProps,
        me: null,
      }),
    }),
  }),
}

export const LandingLoggedInStoryProps: LandingProps = {
  ...LandingStoryProps,
  headerPageTemplateWithProps: withPropsStatic<HeaderPageTemplateProps>({
    isAuthenticated: true,
    headerPageWithProps: withPropsStatic<HeaderPageProps>({
      ...HeaderPageStoryProps,
      // isAuthenticated: true,
      headerWithProps: withPropsStatic<HeaderProps>({
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
