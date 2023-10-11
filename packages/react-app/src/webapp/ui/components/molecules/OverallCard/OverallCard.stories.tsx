import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
// import { href } from '../../../../elements/link'
// import { Grade, LibraryBooks, PermIdentity } from '@mui/icons-material'
import { FilterNone, Grade, PermIdentity } from '@mui/icons-material'
import { href } from '../../../../../common/lib.mjs'
import type { OverallCardProps } from './OverallCard.js'
import { OverallCard } from './OverallCard.js'

const meta: ComponentMeta<typeof OverallCard> = {
  title: 'Molecules/OverallCard',
  component: OverallCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'OverallCardStoryProps',
    'OverallCardNoCardStoryProps',
    'OverallCardIconsStoryProps',
  ],
  decorators: [
    Story => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
}

export const OverallCardStoryProps: OverallCardProps = {
  items: [
    { Icon: PermIdentity, href: href('Pages/Followers'), name: 'Followers', value: 25 },
    { Icon: Grade, name: 'Kudos', value: 121 },
    { Icon: FilterNone, name: 'Resources', value: 23 },
  ],
}

export const OverallCardNoCardStoryProps: OverallCardProps = {
  ...OverallCardStoryProps,
  noCard: true,
}

export const OverallCardIconsStoryProps: OverallCardProps = {
  ...OverallCardStoryProps,
  showIcons: true,
}

const OverallCardStory: ComponentStory<typeof OverallCard> = args => <OverallCard {...args} />

export const Default: typeof OverallCardStory = OverallCardStory.bind({})
Default.args = OverallCardStoryProps

export const NoCard: typeof OverallCardStory = OverallCardStory.bind({})
NoCard.args = OverallCardNoCardStoryProps

export const Icons: typeof OverallCardStory = OverallCardStory.bind({})
Icons.args = OverallCardIconsStoryProps

export default meta
