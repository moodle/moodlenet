import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import {
  CollectionCardLoggedInStoryProps,
  CollectionCardLoggedOutStoryProps
} from '../../components/cards/CollectionCard/CollectionCard.stories'
import {
  ResourceCardLoggedInStoryProps,
  ResourceCardLoggedOutStoryProps
} from '../../components/cards/ResourceCard/ResourceCard.stories'
import { SubjectCardProps } from '../../components/cards/SubjectCard/SubjectCard'
import { SubjectCardStoryProps } from '../../components/cards/SubjectCard/SubjectCard.stories'
import { href } from '../../elements/link'
import {
  SmallProfileCardFollowingStoryProps,
  SmallProfileCardLoggedInStoryProps,
  SmallProfileCardLoggedOutStoryProps
} from '../cards/SmallProfileCard/SmallProfileCard.stories'
import { Browser, BrowserProps } from './Browser'

const meta: ComponentMeta<typeof Browser> = {
  title: 'Components/Organisms/Browser',
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
    Story => (
      <div style={{ margin: '50px' }}>
        <Story />
      </div>
    ),
  ],
}

const BrowserStory: ComponentStory<typeof Browser> = args => <Browser {...args} />

const subjectCardPropsList: SubjectCardProps[] = [
  '#Education',
  '#Forestry',
  'Enviromental Science with a lot of Mathematics and Physics',
  'Sailing Principles',
  'Latin',
  'Hebrew',
  'NoShow',
].map(x => ({
  organization: { ...SubjectCardStoryProps }.organization,
  title: x,
  subjectHomeHref: href('Subject/home'),
}))

export const BrowserLoggedOutStoryProps: BrowserProps = {
  setSortBy: action(`set sort by`),
  loadMoreSubjects: action(`load more subjects`),
  loadMoreCollections: action(`load more collections`),
  loadMoreResources: action(`load more resources`),
  loadMorePeople: action(`load more people`),
  subjectCardPropsList: subjectCardPropsList,
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
    ResourceCardLoggedOutStoryProps,
    ResourceCardLoggedOutStoryProps,
    ResourceCardLoggedOutStoryProps,
  ],
  smallProfileCardPropsList: [
    SmallProfileCardLoggedOutStoryProps,
    SmallProfileCardLoggedOutStoryProps,
    SmallProfileCardLoggedOutStoryProps,
    SmallProfileCardLoggedOutStoryProps,
    SmallProfileCardLoggedOutStoryProps,
    SmallProfileCardLoggedOutStoryProps,
    SmallProfileCardLoggedOutStoryProps,
    SmallProfileCardLoggedOutStoryProps,
    SmallProfileCardLoggedOutStoryProps,
    SmallProfileCardLoggedOutStoryProps,
    SmallProfileCardLoggedOutStoryProps,
    SmallProfileCardLoggedOutStoryProps,
    SmallProfileCardLoggedOutStoryProps,
  ],
}

export const BrowserLoggedInStoryProps: BrowserProps = {
  setSortBy: action(`set sort by`),
  subjectCardPropsList: subjectCardPropsList,
  collectionCardPropsList: [
    CollectionCardLoggedInStoryProps,
    CollectionCardLoggedInStoryProps,
    CollectionCardLoggedInStoryProps,
    CollectionCardLoggedInStoryProps,
    CollectionCardLoggedInStoryProps,
    CollectionCardLoggedInStoryProps,
    CollectionCardLoggedInStoryProps,
    CollectionCardLoggedInStoryProps,
    CollectionCardLoggedInStoryProps,
    CollectionCardLoggedInStoryProps,
    CollectionCardLoggedInStoryProps,
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
    SmallProfileCardLoggedInStoryProps,
    SmallProfileCardLoggedInStoryProps,
    SmallProfileCardLoggedInStoryProps,
    SmallProfileCardLoggedInStoryProps,
    SmallProfileCardLoggedInStoryProps,
    SmallProfileCardLoggedInStoryProps,
    SmallProfileCardLoggedInStoryProps,
    SmallProfileCardLoggedInStoryProps,
    SmallProfileCardLoggedInStoryProps,
    SmallProfileCardLoggedInStoryProps,
    SmallProfileCardLoggedInStoryProps,
    SmallProfileCardLoggedInStoryProps,
    SmallProfileCardLoggedInStoryProps,
  ],
}

export const BrowserFollowingStoryProps: BrowserProps = {
  ...BrowserLoggedInStoryProps,
  smallProfileCardPropsList: [
    SmallProfileCardFollowingStoryProps,
    SmallProfileCardFollowingStoryProps,
    SmallProfileCardFollowingStoryProps,
    SmallProfileCardFollowingStoryProps,
    SmallProfileCardFollowingStoryProps,
    SmallProfileCardFollowingStoryProps,
    SmallProfileCardFollowingStoryProps,
    SmallProfileCardFollowingStoryProps,
    SmallProfileCardFollowingStoryProps,
    SmallProfileCardFollowingStoryProps,
    SmallProfileCardFollowingStoryProps,
    SmallProfileCardFollowingStoryProps,
    SmallProfileCardFollowingStoryProps,
  ],
}

export const LoggedOut = BrowserStory.bind({})
LoggedOut.args = BrowserLoggedOutStoryProps

export const LoggedIn = BrowserStory.bind({})
LoggedIn.args = BrowserLoggedInStoryProps

export const Following = BrowserStory.bind({})
Following.args = BrowserFollowingStoryProps

export default meta
