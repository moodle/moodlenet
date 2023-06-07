import { LibraryAdd as LibraryAddIcon, NoteAdd as NoteAddIcon } from '@material-ui/icons'
import { action } from '@storybook/addon-actions'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import addIcon from '../../../assets/icons/add-round.svg'
import type { FloatingMenuProps } from './FloatingMenu.js'
import { FloatingMenu } from './FloatingMenu.js'

const meta: ComponentMeta<typeof FloatingMenu> = {
  title: 'Atoms/FloatingMenu',
  component: FloatingMenu,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['FloatingMenuStoryProps'],
  decorators: [
    Story => (
      <div style={{ position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
}

export const FloatingMenuStoryProps: FloatingMenuProps = {
  hoverElement: <img className="add-icon" src={addIcon} alt="Add" />,
  menuContent: [
    {
      key: '1',
      name: 'New Resource',
      Icon: <NoteAddIcon />,
      onClick: action('new resource'),
    },
    {
      key: '2',
      name: 'New Collection',
      Icon: <LibraryAddIcon />,
      onClick: action('new collection'),
    },
    // {
    //   Element: (
    //     <div key="__">
    //       <div>
    //         <NoteAddIcon />
    //         New Resource
    //       </div>
    //       <div>
    //         <LibraryAddIcon />
    //         New Collection
    //       </div>
    //     </div>
    //   ),
    // },
  ],
}

const FloatingMenuStory: ComponentStory<typeof FloatingMenu> = args => (
  <FloatingMenu {...args}>
    <div>This</div>
    <div>And that</div>
  </FloatingMenu>
)

export const Default = FloatingMenuStory.bind({})
Default.args = FloatingMenuStoryProps

export default meta
