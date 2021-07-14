import { ComponentMeta, ComponentStory } from '@storybook/react'
import { HeaderTitle, HeaderTitleProps } from './HeaderTitle'

const meta: ComponentMeta<typeof HeaderTitle> = {
  title: 'Components/Headers/HeaderTitle',
  component: HeaderTitle,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['HeaderTitleStoryProps'],
}

export const HeaderTitleStoryProps: HeaderTitleProps = {
  organization: {
    name: 'BFH',
    url: 'https://www.bfh.ch/',
    logo: 'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg'
  },
}

const HeaderTitleStory: ComponentStory<typeof HeaderTitle> = args => <HeaderTitle {...args} />

export const Default = HeaderTitleStory.bind({})
Default.args = HeaderTitleStoryProps

export default meta
