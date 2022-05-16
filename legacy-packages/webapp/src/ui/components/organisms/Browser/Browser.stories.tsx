import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { randomIntFromInterval } from '../../../../helpers/utilities'
import { href } from '../../../elements/link'
import {
  CollectionCardLoggedInStoryProps,
  CollectionCardLoggedOutStoryProps,
} from '../../molecules/cards/CollectionCard/CollectionCard.stories'
import {
  ResourceCardLoggedInStoryProps,
  ResourceCardLoggedOutStoryProps,
} from '../../molecules/cards/ResourceCard/ResourceCard.stories'
import {
  SmallProfileCardFollowingStoryProps,
  SmallProfileCardLoggedInStoryProps,
  SmallProfileCardStoryProps,
} from '../../molecules/cards/SmallProfileCard/SmallProfileCard.stories'
import { SubjectCardProps } from '../../molecules/cards/SubjectCard/SubjectCard'
import { SubjectCardStoryProps } from '../../molecules/cards/SubjectCard/SubjectCard.stories'
import { Browser, BrowserProps } from './Browser'

const meta: ComponentMeta<typeof Browser> = {
  title: 'Organisms/Browser',
  component: Browser,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'BrowserStoryProps',
    'BrowserLoggedOutStoryProps',
    'BrowserLoggedInStoryProps',
    'BrowserFollowingStoryProps',
  ],
  decorators: [
    (Story) => (
      <div style={{ margin: '50px' }}>
        <Story />
      </div>
    ),
  ],
}

const BrowserStory: ComponentStory<typeof Browser> = (args) => (
  <Browser {...args} />
)

const subjectCardPropsList: SubjectCardProps[] = [
  '#Education',
  '#Forestry',
  'Enviromental Science with a lot of Mathematics and Physics',
  'Sailing Principles',
  'Latin',
  'Hebrew',
  'NoShow',
].map((x) => ({
  organization: { ...SubjectCardStoryProps }.organization,
  title: x,
  subjectHomeHref: href('Subject/home'),
}))

export const BrowserLoggedOutStoryProps: BrowserProps = {
  title: 'Bookmarks',
  setSortBy: action(`set sort by`),
  setFilters: action(`set Filters`),
  loadMoreSubjects: action(`load more subjects`),
  loadMoreCollections: action(`load more collections`),
  loadMoreResources: action(`load more resources`),
  loadMorePeople: action(`load more people`),
  subjectCardPropsList: subjectCardPropsList,
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
    ResourceCardLoggedOutStoryProps(),
    ResourceCardLoggedOutStoryProps(),
    ResourceCardLoggedOutStoryProps(),
    ResourceCardLoggedOutStoryProps(),
    ResourceCardLoggedOutStoryProps(),
    ResourceCardLoggedOutStoryProps(),
    ResourceCardLoggedOutStoryProps(),
    ResourceCardLoggedOutStoryProps(),
    ResourceCardLoggedOutStoryProps(),
    ResourceCardLoggedOutStoryProps(),
    ResourceCardLoggedOutStoryProps(),
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

export const BrowserLoggedInStoryProps: BrowserProps = {
  setSortBy: action(`set sort by`),
  setFilters: action(`set Filters`),
  subjectCardPropsList: subjectCardPropsList,
  collectionCardPropsList: [
    CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
    CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
  ],
  resourceCardPropsList: [
    ResourceCardLoggedInStoryProps,
    ResourceCardLoggedInStoryProps,
    ResourceCardLoggedInStoryProps,
    ResourceCardLoggedInStoryProps,
    ResourceCardLoggedInStoryProps,
    ResourceCardLoggedInStoryProps,
    ResourceCardLoggedInStoryProps,
    ResourceCardLoggedInStoryProps,
    ResourceCardLoggedInStoryProps,
    ResourceCardLoggedInStoryProps,
    ResourceCardLoggedInStoryProps,
    ResourceCardLoggedInStoryProps,
  ],
  smallProfileCardPropsList: [
    SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
  ],
}

export const BrowserFollowingStoryProps: BrowserProps = {
  ...BrowserLoggedInStoryProps,
  smallProfileCardPropsList: [
    SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
    SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
  ],
}

export const LoggedOut = BrowserStory.bind({})
LoggedOut.args = BrowserLoggedOutStoryProps

export const LoggedIn = BrowserStory.bind({})
LoggedIn.args = BrowserLoggedInStoryProps

export const Following = BrowserStory.bind({})
Following.args = BrowserFollowingStoryProps

export default meta
