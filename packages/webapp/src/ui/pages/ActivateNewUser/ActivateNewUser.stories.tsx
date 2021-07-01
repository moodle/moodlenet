import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ActivateNewUserPanelProps } from '../../components/ActivateUserPanel/ActivateUserPanel'
import { activateNewUserPanelStoryProps } from '../../components/ActivateUserPanel/ActivateUserPanel.stories'
import { href } from '../../elements/link'
import { sbCtrlBagOf } from '../../lib/ctrl'
import { ActivateNewUserPage, ActivateNewUserPageProps } from './ActivateNewUser'

const meta: ComponentMeta<typeof ActivateNewUserPage> = {
  title: 'Test/ActivateNewUserPage',
  component: ActivateNewUserPage,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
}

const ActivateUserPageStory: ComponentStory<typeof ActivateNewUserPage> = args => <ActivateNewUserPage {...args} />

const activateNewUserPageStoryProps: ActivateNewUserPageProps = {
  ActivateNewUserPanelCtrl: sbCtrlBagOf<ActivateNewUserPanelProps>({
    message: '',
    mycss: 'blue',
    submit: action('submit in page story'),
    termsAndConditionsLink: href('**'),
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
