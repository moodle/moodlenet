import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SBSimplifiedForm } from '../../../../lib/storybook/SBFormikBag'
import { NewCollectionFormValuesNew } from '../types'
import { CreateCollection, CreateCollectionProps } from './CreateCollection'

const meta: ComponentMeta<typeof CreateCollection> = {
  title: 'Pages/New Resource/Create Collection',
  component: CreateCollection,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['CreateCollectionStoryProps', 'Default'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1100 }}>
        <Story />
      </div>
    ),
  ],
}

export const CreateCollectionStoryProps: CreateCollectionProps = {
  form: SBSimplifiedForm<NewCollectionFormValuesNew>({
    title: '',
    published: 'Visible',
    description: '',
    imageUrl: '',
    image: '',
  }),
}

const CreateCollectionStory: ComponentStory<typeof CreateCollection> = (
  args
) => <CreateCollection {...args} />

export const Default = CreateCollectionStory.bind({})
Default.args = CreateCollectionStoryProps

export default meta
