import { ComponentMeta, ComponentStory } from '@storybook/react'
import {
  CollectionCardLoggedOutStoryProps,
  CollectionCardStoryProps
} from '../../components/cards/CollectionCard/CollectionCard.stories'
import {
  ResourceCardLoggedOutStoryProps,
  ResourceCardStoryProps
} from '../../components/cards/ResourceCard/ResourceCard.stories'
import { TrendCardStoryProps } from '../../components/molecules/cards/TrendCard/TrendCard.stories'
import { href } from '../../elements/link'
import {
  HeaderPageTemplateLoggedInStoryProps,
  HeaderPageTemplateLoggedOutStoryProps,
  HeaderPageTemplateOrganizationLoggedInStoryProps,
  HeaderPageTemplateOrganizationLoggedOutStoryProps
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
    'HeaderPageTemplateLoggedOutStoryProps',
  ],
}

const contentLoggedIn = {
  collectionCardPropsList: [
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
  ],
  resourceCardPropsList: [
    ResourceCardStoryProps,
    ResourceCardStoryProps,
    ResourceCardStoryProps,
    ResourceCardStoryProps,
    ResourceCardStoryProps,
    ResourceCardStoryProps,
  ],
}

const contentLoggedOut = {
  collectionCardPropsList: [
    CollectionCardLoggedOutStoryProps,
    CollectionCardLoggedOutStoryProps,
    CollectionCardLoggedOutStoryProps,
    CollectionCardLoggedOutStoryProps,
    CollectionCardLoggedOutStoryProps,
    CollectionCardLoggedOutStoryProps,
    CollectionCardLoggedOutStoryProps,
    CollectionCardLoggedOutStoryProps,
    CollectionCardLoggedOutStoryProps,
  ],
  resourceCardPropsList: [
    ResourceCardLoggedOutStoryProps,
    ResourceCardLoggedOutStoryProps,
    ResourceCardLoggedOutStoryProps,
    ResourceCardLoggedOutStoryProps,
    ResourceCardLoggedOutStoryProps,
    ResourceCardLoggedOutStoryProps,
    ResourceCardLoggedOutStoryProps,
    ResourceCardLoggedOutStoryProps,
  ],
}

const LandingStory: ComponentStory<typeof Landing> = args => <Landing {...args} />

export const LandingLoggedInStoryProps: LandingProps = {
  headerPageTemplateProps: HeaderPageTemplateLoggedInStoryProps,
  ...contentLoggedIn,
  trendCardProps: TrendCardStoryProps,
  organization: {
    name: 'MoodleNet',
    intro: `Share and curate open educational resources.\n
            Integrated with Moodle LMS and Moodle Workplace to make resources easy to find and use.\n
            Build your profile as an educator.`,
  },
  image: 'https://picsum.photos/200/100',

  isAuthenticated: true,
  signUpHref: href('Pages/SignUp/Sign Up'),
}

export const LandingLoggedOutStoryProps: LandingProps = {
  ...LandingLoggedInStoryProps,
  headerPageTemplateProps: HeaderPageTemplateLoggedOutStoryProps,
  ...contentLoggedOut,
  isAuthenticated: false,
}

export const LandingOrganizationLoggedInStoryProps: LandingProps = {
  headerPageTemplateProps: HeaderPageTemplateOrganizationLoggedInStoryProps,
  trendCardProps: TrendCardStoryProps,
  ...contentLoggedIn,
  organization: {
    name: 'Bern University of Applied Sciences',
    intro: 'Diverse, sound, dynamic – these are the values that define BFH. And this is our MoodleNet server. ',
  },
  image: 'https://picsum.photos/200/100',
  isAuthenticated: true,
  signUpHref: href('Pages/SignUp/Sign Up'),
}

export const LandingOrganizationLoggedOutStoryProps: LandingProps = {
  ...LandingOrganizationLoggedInStoryProps,
  headerPageTemplateProps: HeaderPageTemplateOrganizationLoggedOutStoryProps,
  ...contentLoggedOut,
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
