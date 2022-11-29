import { ComponentMeta, ComponentStory } from '@storybook/react'
import {
  MinimalisticHeaderOrganizationStoryProps,
  MinimalisticHeaderStoryProps,
} from '../../organisms/Header/Minimalistic/MinimalisticHeader.stories.js'
// import { href } from '../../../../elements/link'

import SimpleLayout, { SimpleLayoutProps } from './SimpleLayout.js'

const meta: ComponentMeta<typeof SimpleLayout> = {
  title: 'Organisms/SimpleLayout',
  component: SimpleLayout,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'SimpleLayoutStory',
    'SimpleLayoutStoryProps',
    'SimpleLayoutOrganizationStoryProps',
  ],
}

export const SimpleLayoutStoryProps: SimpleLayoutProps = {
  headerProps: MinimalisticHeaderStoryProps,
  //   homeHrpef: href('Landing/Logged In'),
  // organization: { ...SimpleLayoutTitleStoryProps },
}

export const SimpleLayoutOrganizationStoryProps: SimpleLayoutProps = {
  headerProps: MinimalisticHeaderOrganizationStoryProps,
  //   homeHref: href('Landing/Logged In'),
  // organization: { ...SimpleLayoutTitleOrganizationStoryProps },
}

export const SimpleLayoutStory: ComponentStory<typeof SimpleLayout> = args => (
  <SimpleLayout {...args} />
)

export const Default = SimpleLayoutStory.bind({})
Default.args = SimpleLayoutStoryProps

export const Organization = SimpleLayoutStory.bind({})
Organization.args = SimpleLayoutOrganizationStoryProps

export default meta
