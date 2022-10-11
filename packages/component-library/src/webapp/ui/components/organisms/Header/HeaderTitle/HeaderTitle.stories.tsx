import { ComponentMeta, ComponentStory } from '@storybook/react'
// import { href } from '../../../../elements/link'
import smallLogo from '../../../../assets/logos/moodlenet-logo-small.svg'
import logo from '../../../../assets/logos/moodlenet-logo.svg'
import { HeaderTitle, HeaderTitleProps } from './HeaderTitle.js'

const meta: ComponentMeta<typeof HeaderTitle> = {
  title: 'Atoms/HeaderTitle',
  component: HeaderTitle,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['HeaderTitleStoryProps', 'HeaderTitleOrganizationStoryProps'],
}

export const HeaderTitleStoryProps: HeaderTitleProps = {
  //   homeHref: href('Landing/Logged In'),
    url: '/',
    logo: logo,
    smallLogo: smallLogo,
}

export const HeaderTitleOrganizationStoryProps: HeaderTitleProps = {
  //   homeHref: href('Landing/Logged In'),
    url: 'https://www.bfh.ch/',
    logo: 'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg',
    smallLogo: 'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg',
}

const HeaderTitleStory: ComponentStory<typeof HeaderTitle> = args => <HeaderTitle {...args} />

export const HeaderTitleDefault = HeaderTitleStory.bind({})
HeaderTitleDefault.args = HeaderTitleStoryProps

export const HeaderTitleOrganization = HeaderTitleStory.bind({})
HeaderTitleOrganization.args = HeaderTitleOrganizationStoryProps

export default meta
