import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { href } from '../../../../../common/lib.mjs'
// import { href } from '../../../../elements/link'
import smallLogo from '../../../assets/logos/moodlenet-logo-small.svg'
import logo from '../../../assets/logos/moodlenet-logo.svg'
import type { HeaderTitleProps } from './HeaderTitle'
import { HeaderTitle } from './HeaderTitle'

const meta: ComponentMeta<typeof HeaderTitle> = {
  title: 'Atoms/HeaderTitle',
  component: HeaderTitle,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['HeaderTitleStoryProps', 'HeaderTitleOrganizationStoryProps'],
  parameters: {
    layout: 'centered',
  },
}

export const HeaderTitleStoryProps: HeaderTitleProps = {
  url: href('Pages/Landing/Logged In'),
  logo: logo,
  smallLogo: smallLogo,
}

export const HeaderTitleOrganizationStoryProps: HeaderTitleProps = {
  ...HeaderTitleStoryProps,
  logo: 'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg',
  smallLogo: 'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg',
}

const HeaderTitleStory: ComponentStory<typeof HeaderTitle> = args => <HeaderTitle {...args} />

export const HeaderTitleDefault: typeof HeaderTitleStory = HeaderTitleStory.bind({})
HeaderTitleDefault.args = HeaderTitleStoryProps

export const HeaderTitleOrganization: typeof HeaderTitleStory = HeaderTitleStory.bind({})
HeaderTitleOrganization.args = HeaderTitleOrganizationStoryProps

export default meta
