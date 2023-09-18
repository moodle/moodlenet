import type { ComponentMeta, ComponentStory } from '@storybook/react'
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

export const Default = OverallCardStory.bind({})
Default.args = OverallCardStoryProps

export const NoCard = OverallCardStory.bind({})
NoCard.args = OverallCardNoCardStoryProps

export const Icons = OverallCardStory.bind({})
Icons.args = OverallCardIconsStoryProps

export default meta
