import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CollectionCard } from '../CollectionCard/CollectionCard'
import { CollectionCardStoryProps } from '../CollectionCard/CollectionCard.stories'
import ResourceCard from '../ResourceCard/ResourceCard'
import { ResourceCardStoryProps } from '../ResourceCard/ResourceCard.stories'
import { ListCard, ListCardProps } from './ListCard'
const meta: ComponentMeta<typeof ListCard> = {
  title: 'Components/Cards/ListCard',
  component: ListCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['CollectionListCardStoryProps', 'ResourceListCardStoryProps'],
  decorators:[
    (Story)=>(<div style={{width: 300}}><Story/></div>)
  ]
}


const ListCardStory: ComponentStory<typeof ListCard> = args => <ListCard {...args} />

export const CollectionListCardStoryProps: ListCardProps = {
  className: 'collection',
  title: 'Juanito',
  content: [1,2,3].map(()=>(
    <CollectionCard {...CollectionCardStoryProps} />
  ))
}

export const Collection = ListCardStory.bind({})
Collection.args = CollectionListCardStoryProps

export const ResourceListCardStoryProps: ListCardProps = {
  className: 'resources',
  title: 'Lastest Resources',
  content: [1,2,3].map(()=>(
    <ResourceCard {...ResourceCardStoryProps} />
  ))
}

export const Resource = ListCardStory.bind({})
Resource.args = ResourceListCardStoryProps

export default meta
