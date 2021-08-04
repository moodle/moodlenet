import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SBFormikBag } from '../../../lib/storybook/SBFormikBag'
import { NewResourceFormValues } from '../types'
import { ExtraDetails, ExtraDetailsProps } from './ExtraDetails'

const meta: ComponentMeta<typeof ExtraDetails> = {
  title: 'Pages/New Resource/Extra Details',
  component: ExtraDetails,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['ExtraDetailsStoryProps', 'Default'],
  decorators: [
    Story => (
      <div style={{ maxWidth: 1100 }}>
        <Story />
      </div>
    ),
  ],
}

export const ExtraDetailsStoryProps: ExtraDetailsProps = {
  previousStep: action('previousStep'),
  nextStep: action('nextStep'),
  formBag: SBFormikBag<NewResourceFormValues>({
    addToCollections: [],
    category: '',
    content: '',
    contentType: 'Link',
    description: '',
    format: '',
    image: '',
    language: '',
    level: '',
    license: '',
    name: '',
    originalDate: new Date(),
    title: '',
    type: '',
  }),
  step: 'ExtraDetailsStep',
}

const ExtraDetailsStory: ComponentStory<typeof ExtraDetails> = args => <ExtraDetails {...args} />

export const Default = ExtraDetailsStory.bind({})
Default.args = ExtraDetailsStoryProps

export default meta
