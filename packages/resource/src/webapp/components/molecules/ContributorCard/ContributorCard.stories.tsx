import { people, randomIntFromInterval } from '@moodlenet/component-library'
import { href } from '@moodlenet/react-app/ui'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ContributorCard, ContributorCardProps } from './ContributorCard.js'

const meta: ComponentMeta<typeof ContributorCard> = {
  title: 'Pages/Resource/ContributorCard',
  component: ContributorCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['ContributorCardStoryProps', 'Default'],
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
const person = people[randomProfileIndex]

export const ContributorCardStoryProps: ContributorCardProps = {
  avatarUrl: person ? person.avatarUrl : null,
  displayName: person ? person.title : '',
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

const ContributorCardStory: ComponentStory<typeof ContributorCard> = args => (
  <ContributorCard {...args} />
)

export const Default = ContributorCardStory.bind({})
Default.args = ContributorCardStoryProps

export default meta
