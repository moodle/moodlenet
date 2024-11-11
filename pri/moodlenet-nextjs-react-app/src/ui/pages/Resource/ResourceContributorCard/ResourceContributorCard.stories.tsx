import { peopleFactory, randomIntFromInterval } from '@moodlenet/component-library'
import { href } from '@moodlenet/react-app/common'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import type { ResourceContributorCardProps } from './ResourceContributorCard'
import { ResourceContributorCard } from './ResourceContributorCard'
const meta: ComponentMeta<typeof ResourceContributorCard> = {
  title: 'Pages/Resource/ResourceContributorCard',
  component: ResourceContributorCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['ResourceContributorCardStoryProps', 'Default'],
  decorators: [
    Story => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

const person = peopleFactory[randomIntFromInterval(0, 3)]

export const ResourceContributorCardStoryProps: ResourceContributorCardProps = {
  avatarUrl: person ? person.avatarUrl : null,
  displayName: person ? person.displayName : '',
  timeSinceCreation: '2023-04-19T10:03:44.540Z',
  creatorProfileHref: href('Pages/Profile/Logged In'),
}

const ResourceContributorCardStory: ComponentStory<typeof ResourceContributorCard> = args => (
  <ResourceContributorCard {...args} />
)

export const Default: typeof ResourceContributorCardStory = ResourceContributorCardStory.bind({})
Default.args = ResourceContributorCardStoryProps

export default meta
