import { overrideDeep } from '@moodlenet/component-library/common'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import type { PartialDeep } from 'type-fest'
import {
  HeaderTitleOrganizationStoryProps,
  HeaderTitleStoryProps,
} from '../../../atoms/HeaderTitle/HeaderTitle.stories.js'

// import { href } from '../../../../elements/link'
import type { MinimalisticHeaderProps } from './MinimalisticHeader.js'
import { MinimalisticHeader } from './MinimalisticHeader.js'

const meta: ComponentMeta<typeof MinimalisticHeader> = {
  title: 'Organisms/MinimalisticHeader',
  component: MinimalisticHeader,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['MinimalisticHeaderStoryProps', 'MinimalisticHeaderOrganizationStoryProps'],
}

export const MinimalisticHeaderStoryProps = (
  overrides?: PartialDeep<MinimalisticHeaderProps>,
): MinimalisticHeaderProps => {
  // page: 'login',
  // loginHref: href('Pages/Access/Login/Default'),
  // signupHref: href('Pages/Access/SignUp/Default'),
  return overrideDeep<MinimalisticHeaderProps>(
    { headerTitleProps: HeaderTitleStoryProps, leftItems: [], centerItems: [], rightItems: [] },
    overrides,
  )
}

export const MinimalisticHeaderOrganizationStoryProps: MinimalisticHeaderProps = {
  ...MinimalisticHeaderStoryProps(),
  headerTitleProps: HeaderTitleOrganizationStoryProps,
}

const MinimalisticHeaderStory: ComponentStory<typeof MinimalisticHeader> = args => (
  <MinimalisticHeader {...args} />
)

export const Default: typeof MinimalisticHeaderStory = MinimalisticHeaderStory.bind({})
Default.args = MinimalisticHeaderStoryProps()

export const Organization: typeof MinimalisticHeaderStory = MinimalisticHeaderStory.bind({})
Organization.args = MinimalisticHeaderOrganizationStoryProps

export default meta
