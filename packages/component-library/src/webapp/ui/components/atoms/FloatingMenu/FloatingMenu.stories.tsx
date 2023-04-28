import { LibraryAdd as LibraryAddIcon, NoteAdd as NoteAddIcon } from '@material-ui/icons'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import addIcon from '../../../assets/icons/add-round.svg'
import { FloatingMenu, FloatingMenuProps } from './FloatingMenu.js'

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
      Component: () => (
        <div>
          <div>
            <NoteAddIcon />
            New Resource
          </div>
          <div>
            <LibraryAddIcon />
            New Collection
          </div>
        </div>
      ),
      key: '__',
    },
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
