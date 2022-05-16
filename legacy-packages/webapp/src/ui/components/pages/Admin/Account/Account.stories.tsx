import { ComponentMeta, ComponentStory } from '@storybook/react'
import Account, { AccountProps } from './Account'

const meta: ComponentMeta<typeof Account> = {
  // title: 'Pages/Add Resources',
  component: Account,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['AccountStoryProps', 'AccountStory', 'Default'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1100, width: '100%' }}>
        <Story />
      </div>
    ),
  ],
}

export const AccountStoryProps: AccountProps = {}

const AccountStory: ComponentStory<typeof Account> = (args) => (
  <Account {...args} />
)

export const Default = AccountStory.bind({})
Default.args = AccountStoryProps

export default meta
