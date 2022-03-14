import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { randomIntFromInterval } from '../../../../helpers/utilities'
import { href } from '../../../elements/link'
import {
  CollectionCardLoggedOutStoryProps,
  CollectionCardStoryProps,
} from '../../molecules/cards/CollectionCard/CollectionCard.stories'
import {
  ResourceCardLoggedOutStoryProps,
  ResourceCardStoryProps,
} from '../../molecules/cards/ResourceCard/ResourceCard.stories'
import { TrendCardStoryProps } from '../../molecules/cards/TrendCard/TrendCard.stories'
import {
  HeaderPageTemplateLoggedInStoryProps,
  HeaderPageTemplateLoggedOutStoryProps,
  HeaderPageTemplateOrganizationLoggedInStoryProps,
  HeaderPageTemplateOrganizationLoggedOutStoryProps,
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
    CollectionCardStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardStoryProps(randomIntFromInterval(1, 3)),
  ],
  resourceCardPropsList: [
    ResourceCardStoryProps,
    ResourceCardStoryProps,
    ResourceCardStoryProps,
    ResourceCardStoryProps,
    ResourceCardStoryProps,
    ResourceCardStoryProps,
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
    CollectionCardLoggedOutStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardLoggedOutStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardLoggedOutStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardLoggedOutStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardLoggedOutStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardLoggedOutStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardLoggedOutStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardLoggedOutStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardLoggedOutStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardLoggedOutStoryProps(randomIntFromInterval(1, 3)),
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
    ResourceCardLoggedOutStoryProps,
    ResourceCardLoggedOutStoryProps,
    ResourceCardLoggedOutStoryProps,
    ResourceCardLoggedOutStoryProps,
    ResourceCardLoggedOutStoryProps,
    ResourceCardLoggedOutStoryProps,
    ResourceCardLoggedOutStoryProps,
  ],
}

const LandingStory: ComponentStory<typeof Landing> = (args) => (
  <Landing {...args} />
)

export const LandingLoggedInStoryProps: LandingProps = {
  headerPageTemplateProps: HeaderPageTemplateLoggedInStoryProps,
  ...contentLoggedIn,
  trendCardProps: TrendCardStoryProps,
  organization: {
    name: 'MoodleNet Central',
    title: 'Find, share and curate open educational resources',
    subtitle: 'Search for resources, subjects, collections or people',
    // description: `Participate improving global education by crafting, sharing and using high-quality resources and collections.\n\nIntegrated with Moodle LMS and Moodle WorkPlace and may work with any LMS, making resources easy to use.`,
    //description: `Join our social network to share and curate open educational resources with educators world-wide.\n\nIntegrated with Moodle LMS and Moodle Workplace to make resources easy to find and use.\n\nBuild your profile as an educator.`,
    //description: `Join our social network to share and curate open educational resources with educators world-wide.\n\nIntegrated with Moodle LMS and Moodle Workplace to make resources easy to find and use.\n\nBuild your profile as an educator.`,
  },
  isAuthenticated: true,
  signUpHref: href('Pages/Access/SignUp/Default'),
  loadMoreResources: action('Load more'),
  setSearchText: action('Search Text'),
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
    title: 'A collection of our best resources',
    subtitle: 'Search for resources, subjects, collections or people',
    // description:
    //   'Diverse, sound, dynamic – these are the values that define BFH. And this is ',
  },
  isAuthenticated: true,
  signUpHref: href('Pages/Access/SignUp/Default'),
  setSearchText: action('Search Text'),
  loadMoreResources: action('Load more'),
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
