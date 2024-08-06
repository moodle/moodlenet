import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../../elements/link'
import { ContributorCard, ContributorCardProps } from './ContributorCard'

const meta: ComponentMeta<typeof ContributorCard> = {
  title: 'Pages/Collection/ContributorCard',
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

export const ContributorCardStoryProps: ContributorCardProps = {
  avatarUrl:
    'https://images.pexels.com/photos/3746326/pexels-photo-3746326.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200',
  displayName: 'Juanita Rodriguez',
  creatorProfileHref: href('Pages/Profile/Logged In'),
}

const ContributorCardStory: ComponentStory<typeof ContributorCard> = (args) => (
  <ContributorCard {...args} />
)

export const Default = ContributorCardStory.bind({})
Default.args = ContributorCardStoryProps

export default meta
