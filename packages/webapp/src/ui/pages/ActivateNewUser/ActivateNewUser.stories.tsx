import { ComponentMeta, ComponentStory } from '@storybook/react'
import {
  activateNewUserPanelStoryProps,
  ValuedWithMessage,
} from '../../components/ActivateUserPanel/ActivateUserPanel.stories'
import { sbCtrlBagOf } from '../../lib/ctrl'
import { ActivateNewUserPage, ActivateNewUserPageProps } from './ActivateNewUser'

export default {
  title: 'Test/ActivateNewUserPage',
  component: ActivateNewUserPage,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ActivateNewUserPage>

const ActivateUserPageStory: ComponentStory<typeof ActivateNewUserPage> = args => <ActivateNewUserPage {...args} />

const activateNewUserPageStoryProps: ActivateNewUserPageProps = {
  ActivateNewUserPanelCtrl: sbCtrlBagOf(activateNewUserPanelStoryProps),
}

export const Empty = ActivateUserPageStory.bind({})
Empty.args = activateNewUserPageStoryProps

export const ValuedWithWarnMessage = ActivateUserPageStory.bind({})
ValuedWithWarnMessage.args = {
  ActivateNewUserPanelCtrl: sbCtrlBagOf({ ...activateNewUserPanelStoryProps, ...ValuedWithMessage.args }),
}
