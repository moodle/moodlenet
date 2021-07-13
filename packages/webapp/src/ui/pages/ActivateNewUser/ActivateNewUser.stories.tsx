import { ComponentMeta, ComponentStory } from '@storybook/react'
import { sbWithPropsListOf } from '../../lib/ctrl'
import { ActivateNewUserPage, ActivateNewUserPageProps } from './ActivateNewUser'
import { ActivateNewUserPanelProps } from './ActivateUserPanel/ActivateUserPanel'
import { _activateNewUserPanelStoryProps } from './ActivateUserPanel/ActivateUserPanel.stories'

const meta: ComponentMeta<typeof ActivateNewUserPage> = {
  title: 'Pages/ActivateNewUserPage/ActivateNewUserPage',
  component: ActivateNewUserPage,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: /_.+/,
}

const ActivateUserPageStory: ComponentStory<typeof ActivateNewUserPage> = args => <ActivateNewUserPage {...args} />

const _activateNewUserPageStoryProps: ActivateNewUserPageProps = {
  withNewUserPanelWithProps: sbWithPropsListOf<ActivateNewUserPanelProps, 'mycss'>([
    _activateNewUserPanelStoryProps,
    _activateNewUserPanelStoryProps,
  ]),
}

export const Empty = ActivateUserPageStory.bind({})
Empty.args = _activateNewUserPageStoryProps

export const ValuedWithWarnMessage = ActivateUserPageStory.bind({})
ValuedWithWarnMessage.args = {
  withNewUserPanelWithProps: sbWithPropsListOf<ActivateNewUserPanelProps, 'mycss'>([
    {
      ..._activateNewUserPanelStoryProps,
      message: 'error from page story',
    },
  ]),
}

export default meta
