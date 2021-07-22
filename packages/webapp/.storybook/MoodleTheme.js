import { create } from '@storybook/theming';
import logo from '/src/ui/static/img/moodlenet-logo.svg';

export default create({
  base: 'light',
  brandTitle: 'MoodleNet',
  brandUrl: 'https://moodle.net',
  brandImage: logo
});