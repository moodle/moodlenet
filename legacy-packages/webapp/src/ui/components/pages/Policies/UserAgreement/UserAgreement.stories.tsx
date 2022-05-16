import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../../elements/link'
import { AccessHeaderStoryProps } from '../../Access/AccessHeader/AccessHeader.stories'
import { UserAgreement, UserAgreementProps } from './UserAgreement'

const meta: ComponentMeta<typeof UserAgreement> = {
  title: 'Pages/Policies/UserAgreement',
  component: UserAgreement,
  parameters: { layout: 'fullscreen' },
  excludeStories: ['userAgreementtoryProps'],
}

const userAgreementtory: ComponentStory<typeof UserAgreement> = (args) => (
  <UserAgreement {...args} />
)

export const userAgreementtoryProps: UserAgreementProps = {
  accessHeaderProps: AccessHeaderStoryProps,
  mainPageWrapperProps: {
    userAcceptsPolicies: null,
    cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
  },
}

export const Default = userAgreementtory.bind({})
Default.args = userAgreementtoryProps

export default meta
