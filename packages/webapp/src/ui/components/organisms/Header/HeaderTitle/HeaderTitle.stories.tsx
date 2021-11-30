import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../../elements/link'
import { HeaderTitle, HeaderTitleProps } from './HeaderTitle'

const meta: ComponentMeta<typeof HeaderTitle> = {
  title: 'Atoms/HeaderTitle',
  component: HeaderTitle,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'HeaderTitleStoryProps',
    'HeaderTitleOrganizationStoryProps',
  ],
}

export const HeaderTitleStoryProps: HeaderTitleProps = {
  homeHref: href('Landing/Logged In'),
  organization: {
    url: 'https://www.moodle.com/',
    logo: '/moodlenet-logo.svg',
    smallLogo: '/moodlenet-logo-small.svg',
  },
}

export const HeaderTitleOrganizationStoryProps: HeaderTitleProps = {
  homeHref: href('Landing/Logged In'),
  organization: {
    url: 'https://www.bfh.ch/',
    logo: 'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg',
    smallLogo:
      'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg',
  },
}

const HeaderTitleStory: ComponentStory<typeof HeaderTitle> = (args) => (
  <HeaderTitle {...args} />
)

export const Default = HeaderTitleStory.bind({})
Default.args = HeaderTitleStoryProps

export const Organization = HeaderTitleStory.bind({})
Organization.args = HeaderTitleOrganizationStoryProps

export default meta
