import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../../elements/link'
import { AccessHeaderStoryProps } from '../../Access/AccessHeader/AccessHeader.stories'
import { CookiesPolicy, CookiesPolicyProps } from './CookiesPolicy'

const meta: ComponentMeta<typeof CookiesPolicy> = {
  title: 'Pages/Policies/CookiesPolicy',
  component: CookiesPolicy,
  parameters: { layout: 'fullscreen' },
  excludeStories: ['CookiesPolicyStoryProps'],
}

const CookiesPolicyStory: ComponentStory<typeof CookiesPolicy> = (args) => (
  <CookiesPolicy {...args} />
)

export const CookiesPolicyStoryProps: CookiesPolicyProps = {
  accessHeaderProps: AccessHeaderStoryProps,
  mainPageWrapperProps: {
    userAcceptsPolicies: null,
    cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
  },
}

export const Default = CookiesPolicyStory.bind({})
Default.args = CookiesPolicyStoryProps

export default meta
