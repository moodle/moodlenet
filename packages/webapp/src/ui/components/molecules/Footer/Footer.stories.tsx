import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Footer, FooterProps } from './Footer'

const meta: ComponentMeta<typeof Footer> = {
  title: 'Components/Organisms/Footers/Footer',
  component: Footer,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'FooterStoryProps',
  ],
}

export const FooterStoryProps: FooterProps = {

}

const FooterStory: ComponentStory<typeof Footer> = args => <Footer {...args} />

export const Default = FooterStory.bind({})
Default.args = FooterStoryProps
Default.parameters = { layout: 'fullscreen' }

export default meta
