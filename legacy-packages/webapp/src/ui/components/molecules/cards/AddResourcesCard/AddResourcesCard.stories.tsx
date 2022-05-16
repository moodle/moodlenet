import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ResourceCardProps } from '../ResourceCard/ResourceCard'
import { ResourceCardStoryProps } from '../ResourceCard/ResourceCard.stories'
import { AddResourcesCard, AddResourcesCardProps } from './AddResourcesCard'

const meta: ComponentMeta<typeof AddResourcesCard> = {
  title: 'Molecules/AddResourcesCard',
  component: AddResourcesCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['AddResourceCard', 'AddResourcesCardStoryProps'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 800, width: '100%', padding: 20 }}>
        <Story />
      </div>
    ),
  ],
}

export const AddResourceCard: ResourceCardProps = {
  ...ResourceCardStoryProps(),
  isSelected: false,
  resourceHomeHref: undefined,
  selectionMode: true,
}

export const AddResourcesCardStoryProps: AddResourcesCardProps = {
  toggleResource: action('toggleResources'),
  resourceCardPropsList: [
    AddResourceCard,
    { ...AddResourceCard, isSelected: true },
    AddResourceCard,
    AddResourceCard,
    AddResourceCard,
    { ...AddResourceCard, isSelected: true },
  ],
}

const AddResourcesCardStory: ComponentStory<typeof AddResourcesCard> = (
  args
) => <AddResourcesCard {...args} />

export const Default = AddResourcesCardStory.bind({})
Default.args = AddResourcesCardStoryProps

export default meta
