import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CategoryOverallCard, CategoryOverallCardProps } from './CategoryOverallCard'

const meta: ComponentMeta<typeof CategoryOverallCard> = {
  title: 'Components/Cards/CategoryOverallCard',
  component: CategoryOverallCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['CategoryOverallCardStoryProps'],
  decorators:[
    (Story)=>(<div style={{height:100,width:300}}><Story/></div>)
  ]
}

export const CategoryOverallCardStoryProps: CategoryOverallCardProps = {
  followers: 2387,
  collections: 43,
  resources: 165,
}

const CategoryOverallCardStory: ComponentStory<typeof CategoryOverallCard> = args => <CategoryOverallCard {...args} />

export const Default = CategoryOverallCardStory.bind({})
Default.args = CategoryOverallCardStoryProps

export default meta
