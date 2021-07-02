import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CollectionCard, CollectionCardProps } from './CollectionCard'

const meta: ComponentMeta<typeof CollectionCard> = {
  title: 'Components/CollectionCard',
  component: CollectionCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['CollectionCardStoryProps'],
  decorators:[
    (Story)=>(<div style={{height:100,width:300}}><Story/></div>)
  ]
}

export const CollectionCardStoryProps: CollectionCardProps = {
  title: 'collection name',
  imageUrl: 'https://picsum.photos/200/100'
}

const CollectionCardStory: ComponentStory<typeof CollectionCard> = args => <CollectionCard {...args} />

export const Default = CollectionCardStory.bind({})
Default.args = CollectionCardStoryProps

export default meta
