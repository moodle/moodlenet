import '@storybook/addon-links/register';
import { addons } from '@storybook/addons';
import Moodle from './MoodleTheme';

addons.setConfig({
  theme: Moodle,
  sidebar: {
    //showRoots: false,
    collapsedRoots: ['atoms', 'molecules', 'organisms', 'templates', 'Pages', 'emails'],
    showPanel: false
  },
});