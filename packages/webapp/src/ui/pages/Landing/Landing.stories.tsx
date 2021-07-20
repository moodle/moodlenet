import { ComponentMeta, ComponentStory } from '@storybook/react'
import { TrendCardStoryProps } from '../../components/cards/TrendCard/TrendCard.stories'
import { HeaderMoodleStoryProps, HeaderStoryProps } from '../../components/Header/Header.stories'
import { HeaderPageStoryProps } from '../HeaderPage/HeaderPage.stories'
import { Landing, LandingProps } from './Landing'

const meta: ComponentMeta<typeof Landing> = {
  title: 'Pages/Landing',
  component: Landing,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'LandingStoryProps', 
    'LandingLoggedOutStoryProps', 
    'LandingLoggedOutOrganizationtStoryProps', 
    'LandingLoggedInStoryProps',
    'LandingMoodleStoryProps'
  ],
}

const LandingStory: ComponentStory<typeof Landing> = args => <Landing {...args} />

export const LandingMoodleStoryProps: LandingProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageStoryProps,
    isAuthenticated: true,
  },
  trendCardProps: TrendCardStoryProps,
  organization: {
    name: 'MoodleNet',
    intro: `Join our social network to share and curate open educational resources with educators world-wide.\n
            Integrated with Moodle LMS and Moodle Workplace to make resources easy to find and use.\n
            Build your profile as an educator.`
  },
  image: 'https://picsum.photos/200/100',
}

export const LandingStoryProps: LandingProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageStoryProps,
    isAuthenticated: true,
  },
  trendCardProps: TrendCardStoryProps,
  organization: {
    name: 'Bern University of Applied Sciences',
    intro: 'Diverse, sound, dynamic – these are the values that define BFH. And this is our MoodleNet server. ',
  },
  image: 'https://picsum.photos/200/100',
}

export const LandingLoggedOutStoryProps: LandingProps = {
  ...LandingMoodleStoryProps,
  headerPageTemplateProps: {
    isAuthenticated: false,
    headerPageProps: {
      headerProps: {
        ...HeaderMoodleStoryProps,
        me: null,
      },
      subHeaderProps: null,
    },
  },
}

export const LandingLoggedInStoryProps: LandingProps = {
  ...LandingStoryProps,
  headerPageTemplateProps: {
    isAuthenticated: true,
    headerPageProps: {
      ...HeaderPageStoryProps,
      headerProps: HeaderMoodleStoryProps,
    },
  },
}

export const LandingLoggedOutOrganizationtStoryProps: LandingProps = {
  ...LandingStoryProps,
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

export const LoggedOut = LandingStory.bind({})
LoggedOut.args = LandingLoggedOutStoryProps

export const OrganizationLoggedOut = LandingStory.bind({})
OrganizationLoggedOut.args = LandingLoggedOutOrganizationtStoryProps

export const LoggedIn = LandingStory.bind({})
LoggedIn.args = LandingLoggedInStoryProps

export default meta
