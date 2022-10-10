import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { LibraryAdd as LibraryAddIcon, NoteAdd as NoteAddIcon } from '@material-ui/icons'
import addIcon from '../../../assets/icons/add-round.svg'
import { FloatingMenu } from './FloatingMenu.js'
const meta = {
  title: 'Atoms/FloatingMenu',
  component: FloatingMenu,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['FloatingMenuStoryProps'],
  decorators: [
    Story => _jsx('div', { style: { position: 'relative' }, children: _jsx(Story, {}) }),
  ],
}
export const FloatingMenuStoryProps = {
  hoverElement: _jsx('img', { className: 'add-icon', src: addIcon, alt: 'Add' }),
  menuContent: [
    _jsxs('div', {
      children: [
        _jsxs('div', { children: [_jsx(NoteAddIcon, {}), 'New Resource'] }),
        _jsxs('div', { children: [_jsx(LibraryAddIcon, {}), 'New Collection'] }),
      ],
    }),
  ],
}
const FloatingMenuStory = args =>
  _jsxs(FloatingMenu, {
    ...args,
    children: [_jsx('div', { children: 'This' }), _jsx('div', { children: 'And that' })],
  })
export const FloatingMenuDefault = FloatingMenuStory.bind({})
FloatingMenuDefault.args = FloatingMenuStoryProps
export default meta
//# sourceMappingURL=FloatingMenu.stories.js.map
