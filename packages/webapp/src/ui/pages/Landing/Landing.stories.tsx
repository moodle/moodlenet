import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { TrendCardStoryProps } from '../../components/molecules/cards/TrendCard/TrendCard.stories'
import { HeaderLoggedOutOrganizationStoryProps } from '../../components/molecules/Header/Header.stories'
import { href } from '../../elements/link'
import {
  HeaderPageLoggedInOrganizationStoryProps,
  HeaderPageLoggedInStoryProps,
  HeaderPageLoggedOutStoryProps,
} from '../HeaderPage/HeaderPage.stories'
import { Landing, LandingProps } from './Landing'

const meta: ComponentMeta<typeof Landing> = {
  title: 'Pages/Landing',
  component: Landing,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'LandingLoggedOutStoryProps',
    'LandingLoggedInStoryProps',
    'LandingOrganizationLoggedOutStoryProps',
    'LandingOrganizationLoggedInStoryProps',
  ],
}

const LandingStory: ComponentStory<typeof Landing> = args => <Landing {...args} />

export const LandingLoggedInStoryProps: LandingProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
    },
  },
  trendCardProps: TrendCardStoryProps,
  organization: {
    name: 'MoodleNet',
    introTitle: 'Join our world-wide educators social network',
    intro: `Share and curate open educational resources.\n
            Integrated with Moodle LMS and Moodle Workplace to make resources easy to find and use.\n
            Build your profile as an educator.`,
  },
  image: 'https://picsum.photos/200/100',
  setSearchText: action('setSearchText'),
  isAuthenticated: true,
  signUpHref: href('Pages/SignUp/Sign Up'),
}

export const LandingLoggedOutStoryProps: LandingProps = {
  ...LandingLoggedInStoryProps,
  headerPageTemplateProps: {
    isAuthenticated: false,
    headerPageProps: HeaderPageLoggedOutStoryProps,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
    },
  },
  isAuthenticated: false,
}

export const LandingOrganizationLoggedInStoryProps: LandingProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInOrganizationStoryProps,
    isAuthenticated: true,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
    },
  },
  trendCardProps: TrendCardStoryProps,
  organization: {
    name: 'Bern University of Applied Sciences',
    intro: 'Diverse, sound, dynamic – these are the values that define BFH. And this is our MoodleNet server. ',
  },
  image: 'https://picsum.photos/200/100',
  setSearchText: action('setSearchText'),
  isAuthenticated: true,
  signUpHref: href('Pages/SignUp/Sign Up'),
}

export const LandingOrganizationLoggedOutStoryProps: LandingProps = {
  ...LandingOrganizationLoggedInStoryProps,
  headerPageTemplateProps: {
    isAuthenticated: false,
    headerPageProps: {
      ...HeaderPageLoggedInStoryProps,
      headerProps: HeaderLoggedOutOrganizationStoryProps,
    },
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
    },
  },
  isAuthenticated: false,
}

export const LoggedOut = LandingStory.bind({})
LoggedOut.args = LandingLoggedOutStoryProps

export const LoggedIn = LandingStory.bind({})
LoggedIn.args = LandingLoggedInStoryProps

export const OrganizationLoggedOut = LandingStory.bind({})
OrganizationLoggedOut.args = LandingOrganizationLoggedOutStoryProps

export const OrganizationLoggedIn = LandingStory.bind({})
OrganizationLoggedIn.args = LandingOrganizationLoggedInStoryProps

export default meta
