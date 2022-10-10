import { jsx as _jsx } from 'react/jsx-runtime'
import { action } from '@storybook/addon-actions'
import { Modal } from './Modal.js'
const meta = {
  title: 'Atoms/Modal',
  component: Modal,
}
const ModalStory = args => _jsx(Modal, { ...args })
export const ModalDefault = ModalStory.bind({})
ModalDefault.args = {
  onClose: action('close modal'),
  children: _jsx('h1', { children: 'Modal Content' }),
}
export default meta
//# sourceMappingURL=Modal.stories.js.map
