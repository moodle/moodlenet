import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
// import { href } from '../../../../elements/link'
// import { Grade, LibraryBooks, PermIdentity } from '@mui/icons-material'
import { FilterNone } from '@mui/icons-material'
import { href } from '../../../../../common/lib.mjs'
import { ReactComponent as LeafIcon } from '../../../assets/icons/leaf.svg'
import { ReactComponent as PersonIcon } from '../../../assets/icons/profile.svg'
import type { OverallCardProps } from './OverallCard'
import { OverallCard } from './OverallCard'

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
    {
      Icon: PersonIcon,
      className: 'followers',
      href: href('Pages/Followers'),
      name: 'Followers',
      value: 25,
    },
    {
      Icon: PersonIcon,
      className: 'following',
      href: href('Pages/Following'),
      name: 'Following',
      value: 97,
    },
    { Icon: FilterNone, className: 'resources', name: 'Resources', value: 23 },
  ],
}

export const OverallCardNoCardStoryProps: OverallCardProps = {
  items: [
    {
      Icon: PersonIcon,
      className: 'followers',
      href: href('Pages/Followers'),
      name: 'Followers',
      value: 25,
    },
    { Icon: LeafIcon, name: 'Leaves', className: 'leaves', value: 43212 },
    { Icon: FilterNone, className: 'resources', name: 'Resources', value: 23 },
  ],
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
