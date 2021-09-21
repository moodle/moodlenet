import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { HeaderTitle, HeaderTitleProps } from './HeaderTitle'

const meta: ComponentMeta<typeof HeaderTitle> = {
  title: 'Components/Organisms/Headers/HeaderTitle',
  component: HeaderTitle,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['HeaderTitleStoryProps', 'HeaderTitleOrganizationStoryProps'],
}

export const HeaderTitleStoryProps: HeaderTitleProps = {
  homeHref: href('Landing/Logged In'),
  organization: {
    name: 'MoodleNet',
    url: 'https://www.moodle.com/',
    logo: ''
  },
}

export const HeaderTitleOrganizationStoryProps: HeaderTitleProps = {
  homeHref: href('Landing/Logged In'),
  organization: {
    name: 'BFH',
    url: 'https://www.bfh.ch/',
    logo: 'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg'
  },
}

const HeaderTitleStory: ComponentStory<typeof HeaderTitle> = args => <HeaderTitle {...args} />

export const Default = HeaderTitleStory.bind({})
Default.args = HeaderTitleStoryProps

export const Organization = HeaderTitleStory.bind({})
Organization.args = HeaderTitleOrganizationStoryProps

export default meta
