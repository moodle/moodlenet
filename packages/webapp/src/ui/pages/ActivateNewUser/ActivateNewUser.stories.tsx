import { ComponentMeta, ComponentStory } from '@storybook/react'
import { sbCtrlBagOf } from '../../lib/ctrl'
import { ActivateNewUserPage, ActivateNewUserPageProps } from './ActivateNewUser'
import { ActivateNewUserPanelProps } from './ActivateUserPanel/ActivateUserPanel'
import { activateNewUserPanelStoryProps } from './ActivateUserPanel/ActivateUserPanel.stories'

const meta: ComponentMeta<typeof ActivateNewUserPage> = {
  title: 'Pages/ActivateNewUserPage/ActivateNewUserPage',
  component: ActivateNewUserPage,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
}

const ActivateUserPageStory: ComponentStory<typeof ActivateNewUserPage> = args => <ActivateNewUserPage {...args} />

const activateNewUserPageStoryProps: ActivateNewUserPageProps = {
  ActivateNewUserPanelCtrl: sbCtrlBagOf<ActivateNewUserPanelProps>({
    ...activateNewUserPanelStoryProps,
  }),
}

export const Empty = ActivateUserPageStory.bind({})
Empty.args = activateNewUserPageStoryProps

export const ValuedWithWarnMessage = ActivateUserPageStory.bind({})
ValuedWithWarnMessage.args = {
  ActivateNewUserPanelCtrl: sbCtrlBagOf<ActivateNewUserPanelProps>({
    ...activateNewUserPanelStoryProps,
    message: 'error from page story',
  }),
}

export default meta
