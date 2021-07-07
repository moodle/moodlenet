import { ComponentMeta, ComponentStory } from '@storybook/react'
import { TrendCardStoryProps } from '../../components/TrendCard/TrendCard.stories'
import { Landing, LandingProps } from './Landing'

const meta: ComponentMeta<typeof Landing> = {
  title: 'Pages/Landing',
  component: Landing,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['LandingStoryProps'],
}

const LandingStory: ComponentStory<typeof Landing> = args => <Landing {...args} />

export const LandingStoryProps: LandingProps = {
  trendCardProps: TrendCardStoryProps,
  organization: {
    name: "Bern University of Applied Sciences",
    intro: "Diverse, sound, dynamic – these are the values that define BFH. And this is our MoodleNet server. "
  },
  image: 'https://picsum.photos/200/100'
}

export const Default = LandingStory.bind({})
Default.args = LandingStoryProps

export default meta
