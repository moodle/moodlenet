import { ComponentMeta, ComponentStory } from '@storybook/react'
import { people } from '../../../../../helpers/factories'
import { randomIntFromInterval } from '../../../../../helpers/utilities'
import { href } from '../../../../elements/link'
import { ContributorCard, ContributorCardProps } from './ContributorCard'

const meta: ComponentMeta<typeof ContributorCard> = {
  title: 'Pages/Resource/ContributorCard',
  component: ContributorCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['ContributorCardStoryProps', 'Default'],
  decorators: [
    (Story) => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

const randomProfileIndex = randomIntFromInterval(0, 3)
const randomUploadedHours = randomIntFromInterval(1, 12)

export const ContributorCardStoryProps: ContributorCardProps = {
  avatarUrl: people[randomProfileIndex]?.avatarUrl!,
  displayName: people[randomProfileIndex]?.displayName!,
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

const ContributorCardStory: ComponentStory<typeof ContributorCard> = (args) => (
  <ContributorCard {...args} />
)

export const Default = ContributorCardStory.bind({})
Default.args = ContributorCardStoryProps

export default meta
