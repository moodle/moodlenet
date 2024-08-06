import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Footer, FooterProps } from './Footer'

const meta: ComponentMeta<typeof Footer> = {
  title: 'Organisms/Footer',
  component: Footer,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['FooterStoryProps', 'FooterLoggedInProps'],
  parameters: { layout: 'fullscreen' },
}

export const FooterStoryProps: FooterProps = {
  isAuthenticated: false,
}

export const FooterLoggedInProps: FooterProps = {
  isAuthenticated: true,
}

const FooterStory: ComponentStory<typeof Footer> = (args) => (
  <Footer {...args} />
)

export const LoggedOut = FooterStory.bind({})
LoggedOut.args = FooterStoryProps

export const LoggedIn = FooterStory.bind({})
LoggedIn.args = FooterLoggedInProps

export default meta
