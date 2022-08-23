import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import {
  LanguagesTextOptionProps,
  LevelTextOptionProps,
  TypeTextOptionProps,
} from '../FieldsData'
import { ExtraDetails, ExtraDetailsProps } from './ExtraDetails'

const meta: ComponentMeta<typeof ExtraDetails> = {
  title: 'Pages/Extra Details',
  component: ExtraDetails,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['ExtraDetailsStoryProps', 'Default'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1100 }}>
        <Story />
      </div>
    ),
  ],
}

export const ExtraDetailsStoryProps: ExtraDetailsProps = {
  types: { opts: TypeTextOptionProps, selected: TypeTextOptionProps[1] },
  levels: { opts: LevelTextOptionProps, selected: LevelTextOptionProps[1] },
  languages: {
    opts: LanguagesTextOptionProps,
    selected: LanguagesTextOptionProps[1],
  },
  setLanguageFilter: action('setLanguageFilter'),
  setLevelFilter: action('setLevelFilter'),
  setTypeFilter: action('setTypeFilter'),
}

const ExtraDetailsStory: ComponentStory<typeof ExtraDetails> = (args) => (
  <ExtraDetails {...args} />
)

export const Default = ExtraDetailsStory.bind({})
Default.args = ExtraDetailsStoryProps

export default meta
