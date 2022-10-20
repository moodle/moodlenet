import { ComponentMeta, ComponentStory } from '@storybook/react'
// import { href } from '../../../../elements/link'
import {
  MinimalisticHeaderOrganizationStoryProps,
  MinimalisticHeaderStoryProps,
} from '../../../../../../../component-library/lib/webapp/ui/components/organisms/Header/Minimalistic/MinimalisticHeader.stories.js'

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
  page: 'login',
  headerProps: MinimalisticHeaderStoryProps,
  //   homeHrpef: href('Landing/Logged In'),
  // organization: { ...SimpleLayoutTitleStoryProps },
}

export const SimpleLayoutOrganizationStoryProps: SimpleLayoutProps = {
  page: 'login',
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
