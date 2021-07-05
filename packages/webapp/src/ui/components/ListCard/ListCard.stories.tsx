import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CollectionCard } from '../CollectionCard/CollectionCard'
import { CollectionCardStoryProps } from '../CollectionCard/CollectionCard.stories'
import { ListCard, ListCardProps } from './ListCard'
const meta: ComponentMeta<typeof ListCard> = {
  title: 'Components/ListCard',
  component: ListCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['ListCardStoryProps'],
  decorators:[
    (Story)=>(<div style={{height:100,width:300}}><Story/></div>)
  ]
}

export const ListCardStoryProps: ListCardProps = {
  className: 'sdfdf',
  preTitle:'Collection curated by ',
  title: 'Juanito',
  content: [1,2,3].map(()=>(
    <CollectionCard {...CollectionCardStoryProps} />
  ))
}

const ListCardStory: ComponentStory<typeof ListCard> = args => <ListCard {...args} />

export const Default = ListCardStory.bind({})
Default.args = ListCardStoryProps

export default meta
