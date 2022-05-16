import { ComponentMeta, ComponentStory } from '@storybook/react'
import Appearance, { AppearanceProps } from './Appearance'

const meta: ComponentMeta<typeof Appearance> = {
  // title: 'Pages/Add Resources',
  component: Appearance,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['AppearanceStoryProps', 'AppearanceStory', 'Default'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1100, width: '100%' }}>
        <Story />
      </div>
    ),
  ],
}

export const AppearanceStoryProps: AppearanceProps = {
  organization: {
    url: 'https://www.moodle.com/',
    logo: '/moodlenet-logo.svg',
    smallLogo: '/moodlenet-logo-small.svg',
  },
}

const AppearanceStory: ComponentStory<typeof Appearance> = (args) => (
  <Appearance {...args} />
)

export const Default = AppearanceStory.bind({})
Default.args = AppearanceStoryProps

export default meta
