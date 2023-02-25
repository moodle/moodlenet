import { peopleFactory, randomIntFromInterval } from '@moodlenet/component-library'
import { href } from '@moodlenet/react-app/ui'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ResourceContributorCard, ResourceContributorCardProps } from './ResourceContributorCard.js'

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

const randomProfileIndex = randomIntFromInterval(0, 3)
const randomUploadedHours = randomIntFromInterval(1, 12)
const person = peopleFactory[randomProfileIndex]

export const ResourceContributorCardStoryProps: ResourceContributorCardProps = {
  avatarUrl: person ? person.avatarUrl : null,
  displayName: person ? person.displayName : '',
  timeSinceCreation: `${randomUploadedHours} ${
    randomProfileIndex === 0
      ? 'hours'
      : randomProfileIndex === 1
      ? 'days'
      : randomProfileIndex === 2
      ? 'months'
      : 'years'
  } ago`,
  creatorProfileHref: href('Pages/Profile/LoggedIn'),
}

const ResourceContributorCardStory: ComponentStory<typeof ResourceContributorCard> = args => (
  <ResourceContributorCard {...args} />
)

export const Default = ResourceContributorCardStory.bind({})
Default.args = ResourceContributorCardStoryProps

export default meta
