import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { randomIntFromInterval } from '../../../../helpers/utilities'
import { href } from '../../../elements/link'
import { CollectionCardStoryProps } from '../../molecules/cards/CollectionCard/CollectionCard.stories'
import { ResourceCardStoryProps } from '../../molecules/cards/ResourceCard/ResourceCard.stories'
import {
  HeaderPageLoggedInStoryProps,
  HeaderPageLoggedOutStoryProps,
} from '../HeaderPage/HeaderPage.stories'
import { Subject, SubjectProps } from './Subject'

const meta: ComponentMeta<typeof Subject> = {
  title: 'Pages/Subject',
  component: Subject,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'SubjectStoryProps',
    'SubjectLoggedOutStoryProps',
    'SubjectLoggedInStoryProps',
  ],
}

const SubjectStory: ComponentStory<typeof Subject> = (args) => (
  <Subject {...args} />
)

export const SubjectStoryProps: SubjectProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  },
  isAuthenticated: true,
  title: 'Complex Ecosystems',
  isFollowing: false,
  numFollowers: 2387,
  numCollections: 43,
  numResources: 165,
  organization: {
    name: 'MoodleNet Central',
    smallLogo: '/moodlenet-logo.svg',
  },
  iscedLink:
    'http://uis.unesco.org/en/topic/international-standard-classification-education-isced',
  isIscedSubject: true,
  collectionCardPropsList: [
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
  ],
  toggleFollow: action('toggleFollow'),
}

export const SubjectLoggedOutStoryProps: SubjectProps = {
  ...SubjectStoryProps,
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedOutStoryProps,
    isAuthenticated: false,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  },
  isAuthenticated: false,
}

export const SubjectLoggedInStoryProps: SubjectProps = {
  ...SubjectStoryProps,
  headerPageTemplateProps: {
    ...SubjectStoryProps.headerPageTemplateProps,
    isAuthenticated: true,
  },
}

export const LoggedOut = SubjectStory.bind({})
LoggedOut.args = SubjectLoggedOutStoryProps

export const LoggedIn = SubjectStory.bind({})
LoggedIn.args = SubjectLoggedInStoryProps

export default meta
