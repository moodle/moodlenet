import '@storybook/addon-links/register'
import { addons } from '@storybook/addons'
import Moodle from './MoodleTheme'

addons.setConfig({
  theme: Moodle,
  showPanel: false,
  sidebar: {
    collapsedRoots: ['Atoms', 'Molecules', 'Organisms', 'Templates', 'Pages', 'Emails'],
  },
})
