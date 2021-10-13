import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { TrendCardStoryProps } from '../../components/molecules/cards/TrendCard/TrendCard.stories'
import { HeaderLoggedOutOrganizationStoryProps } from '../../components/molecules/Header/Header.stories'
import { href } from '../../elements/link'
import {
  HeaderPageLoggedInOrganizationStoryProps,
  HeaderPageLoggedInStoryProps,
  HeaderPageLoggedOutStoryProps
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
      userAcceptsPolicies: () => {},
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  },
  trendCardProps: TrendCardStoryProps,
  organization: {
    name: 'MoodleNet',
    introTitle: 'Join our world-wide educators social network',
    intro: `MoodleNet is currently in Public Beta mode, meaning that this site is now live and being tested before its official release.\n
    We encourage you to join the site and become part of the open education movement and our community of MoodleNet testers.\n 
    You will then be able to add open educational resources and create collections, follow subjects or collections that are relevant to you, plus share resources and collections with your Moodle site.\n
    Should you encounter any bugs, glitches, lack of functionality or other problems, please post in the <a href="https://moodle.org/mod/forum/view.php?id=8726" target="_blank" rel="noreferrer">MoodleNet community</a> or create an issue at <a href="https://tracker.moodle.org/projects/MDLNET/summary" target="_blank" rel="noreferrer">MoodleNet Tracker</a>.\n`,
    /* intro: `Share and curate open educational resources.\n
            Integrated with Moodle LMS and Moodle Workplace to make resources easy to find and use.\n
            Build your profile as an educator.`, */
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
    ...LandingLoggedInStoryProps.headerPageTemplateProps,
  },
  isAuthenticated: false,
}

export const LandingOrganizationLoggedInStoryProps: LandingProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInOrganizationStoryProps,
    isAuthenticated: true,
    ...LandingLoggedInStoryProps.headerPageTemplateProps,
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
    ...LandingLoggedInStoryProps.headerPageTemplateProps,
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
