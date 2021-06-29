import { create } from '@storybook/theming';
import logo from '/src/ui/static/img/moodlenet-logo.png';

export default create({
  base: 'light',
  brandTitle: 'MoodleNet',
  brandUrl: 'https://moodle.com',
  brandImage: logo
});