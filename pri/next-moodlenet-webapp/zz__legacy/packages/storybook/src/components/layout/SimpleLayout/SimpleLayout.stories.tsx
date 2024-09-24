import { MinimalisticHeaderStories } from '@moodlenet/react-app/stories'
import type { SimpleLayoutProps } from '@moodlenet/react-app/ui'
import { SimpleLayout } from '@moodlenet/react-app/ui'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { FooterStoryProps } from '../../../components/organisms/Footer/Footer.stories'

const meta: ComponentMeta<typeof SimpleLayout> = {
  title: 'Organisms/SimpleLayout',
  component: SimpleLayout,
  argTypes: {
    // b../../../../../react-app/src/webapp/ui/components/organisms/Header/Minimalistic/MinimalisticHeader.stories.js
  },
  excludeStories: [
    'SimpleLayoutStory',
    'SimpleLayoutStoryProps',
    'SimpleLayoutOrganizationStoryProps',
  ],
}

export const SimpleLayoutStoryProps: SimpleLayoutProps = {
  headerProps: MinimalisticHeaderStories.MinimalisticHeaderStoryProps(),
  footerProps: FooterStoryProps,
  //   homeHrpef: href('Landing/Logged In'),
  // organization: { ...SimpleLayoutTitleStoryProps },
}

export const SimpleLayoutOrganizationStoryProps: SimpleLayoutProps = {
  headerProps: MinimalisticHeaderStories.MinimalisticHeaderOrganizationStoryProps,
  footerProps: FooterStoryProps,
  //   homeHref: href('Landing/Logged In'),
  // organization: { ...SimpleLayoutTitleOrganizationStoryProps },
}

export const SimpleLayoutStory: ComponentStory<typeof SimpleLayout> = args => (
  <SimpleLayout {...args} />
)

export const Default: typeof SimpleLayoutStory = SimpleLayoutStory.bind({})
Default.args = SimpleLayoutStoryProps

export const Organization: typeof SimpleLayoutStory = SimpleLayoutStory.bind({})
Organization.args = SimpleLayoutOrganizationStoryProps

export default meta
