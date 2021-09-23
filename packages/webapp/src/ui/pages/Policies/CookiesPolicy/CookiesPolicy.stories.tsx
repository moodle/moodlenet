import { ComponentMeta, ComponentStory } from '@storybook/react'
import { AccessHeaderStoryProps } from '../../Access/AccessHeader/AccessHeader.stories'
import { CookiesPolicy, CookiesPolicyProps } from './CookiesPolicy'

const meta: ComponentMeta<typeof CookiesPolicy> = {
  title: 'Pages/Policies/CookiesPolicy',
  component: CookiesPolicy,
  parameters: { layout: 'fullscreen' },
  excludeStories: ['CookiesPolicyStoryProps'],
}

const CookiesPolicyStory: ComponentStory<typeof CookiesPolicy> = args => <CookiesPolicy {...args} />

export const CookiesPolicyStoryProps: CookiesPolicyProps = {
  accessHeaderProps: AccessHeaderStoryProps,
}


export const Default = CookiesPolicyStory.bind({})
Default.args = CookiesPolicyStoryProps

export default meta
