import { create } from '@storybook/theming'
import logo from '../public/moodlenet-logo.svg'

export default create({
  base: 'dark',
  brandTitle: 'MoodleNet',
  brandUrl: 'https://moodle.net',
  brandImage: logo,
})
