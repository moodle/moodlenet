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
import { SmallProfileCardStoryProps } from '../../molecules/cards/SmallProfileCard/SmallProfileCard.stories'
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
    CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
  ],
  resourceCardPropsList: [
    ResourceCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
  ],
  smallProfileCardPropsList: [
    SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
  ],
}

const contentLoggedOut = {
  collectionCardPropsList: [
    CollectionCardLoggedOutStoryProps(
      randomIntFromInterval(0, 1) === 0 ? 0 : 1
    ),
    CollectionCardLoggedOutStoryProps(
      randomIntFromInterval(0, 1) === 0 ? 0 : 1
    ),
    CollectionCardLoggedOutStoryProps(
      randomIntFromInterval(0, 1) === 0 ? 0 : 1
    ),
    CollectionCardLoggedOutStoryProps(
      randomIntFromInterval(0, 1) === 0 ? 0 : 1
    ),
    CollectionCardLoggedOutStoryProps(
      randomIntFromInterval(0, 1) === 0 ? 0 : 1
    ),
    CollectionCardLoggedOutStoryProps(
      randomIntFromInterval(0, 1) === 0 ? 0 : 1
    ),
    CollectionCardLoggedOutStoryProps(
      randomIntFromInterval(0, 1) === 0 ? 0 : 1
    ),
    CollectionCardLoggedOutStoryProps(
      randomIntFromInterval(0, 1) === 0 ? 0 : 1
    ),
    CollectionCardLoggedOutStoryProps(
      randomIntFromInterval(0, 1) === 0 ? 0 : 1
    ),
    CollectionCardLoggedOutStoryProps(
      randomIntFromInterval(0, 1) === 0 ? 0 : 1
    ),
    CollectionCardLoggedOutStoryProps(
      randomIntFromInterval(0, 1) === 0 ? 0 : 1
    ),
  ],
  resourceCardPropsList: [
    ResourceCardLoggedOutStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardLoggedOutStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardLoggedOutStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardLoggedOutStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardLoggedOutStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardLoggedOutStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardLoggedOutStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardLoggedOutStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardLoggedOutStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardLoggedOutStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    ResourceCardLoggedOutStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
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
    smallLogo: '/moodlenet-logo.svg',
    // description: `Participate improving global education by crafting, sharing and using high-quality resources and collections.\n\nIntegrated with Moodle LMS and Moodle WorkPlace and may work with any LMS, making resources easy to use.`,
    //description: `Join our social network to share and curate open educational resources with educators world-wide.\n\nIntegrated with Moodle LMS and Moodle Workplace to make resources easy to find and use.\n\nBuild your profile as an educator.`,
    //description: `Join our social network to share and curate open educational resources with educators world-wide.\n\nIntegrated with Moodle LMS and Moodle Workplace to make resources easy to find and use.\n\nBuild your profile as an educator.`,
  },
  isAuthenticated: true,
  loginHref: href('Pages/Access/Login/Default'),
  signUpHref: href('Pages/Access/SignUp/Default'),
  newResourceHref: href('Pages/New Resource/Default'),
  newCollectionHref: href('Pages/New Collection/Start'),
  setSearchText: action('Search Text'),
  searchResourcesHref: href(''), //FIXME
  searchCollectionsHref: href(''), //FIXME
  searchAuthorsHref: href(''), //FIXME
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
    smallLogo: '/moodlenet-logo.svg',
    // description:
    //   'Diverse, sound, dynamic – these are the values that define BFH. And this is ',
  },
  isAuthenticated: true,
  loginHref: href('Pages/Access/Login/Default'),
  signUpHref: href('Pages/Access/SignUp/Default'),
  newResourceHref: href('Pages/New Resource/Default'),
  newCollectionHref: href('Pages/New Collection/Start'),
  setSearchText: action('Search Text'),
  searchResourcesHref: href(''), //FIXME
  searchCollectionsHref: href(''), //FIXME
  searchAuthorsHref: href(''), //FIXME
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
