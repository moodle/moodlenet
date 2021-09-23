import { ComponentMeta, ComponentStory } from '@storybook/react'
import { AccessHeaderStoryProps } from '../../Access/AccessHeader/AccessHeader.stories'
import { UserAgreement, UserAgreementProps } from './UserAgreement'

const meta: ComponentMeta<typeof UserAgreement> = {
  title: 'Pages/Policies/UserAgreement',
  component: UserAgreement,
  parameters: { layout: 'fullscreen' },
  excludeStories: ['UserAgreementStoryProps'],
}

const UserAgreementStory: ComponentStory<typeof UserAgreement> = args => <UserAgreement {...args} />

export const UserAgreementStoryProps: UserAgreementProps = {
  accessHeaderProps: AccessHeaderStoryProps,
}


export const Default = UserAgreementStory.bind({})
Default.args = UserAgreementStoryProps

export default meta
