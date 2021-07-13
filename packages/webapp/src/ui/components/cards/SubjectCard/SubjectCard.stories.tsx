import { ComponentMeta, ComponentStory } from '@storybook/react'
import SubjectCard, { SubjectCardProps } from './SubjectCard'

const meta: ComponentMeta<typeof SubjectCard> = {
  title: 'Components/Cards/SubjectCard',
  component: SubjectCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['SubjectCardStoryProps'],
  decorators:[
    (Story)=>(<div style={{height:100,width:300}}><Story/></div>)
  ]
}

export const SubjectCardStoryProps: SubjectCardProps = {
  title: 'Latest Resources',
  organization: {
    url: 'uws.edu',
    color: '#40E3A4'
  }
}

const SubjectCardStory: ComponentStory<typeof SubjectCard> = args => <SubjectCard {...args} />

export const Default = SubjectCardStory.bind({})
Default.args = SubjectCardStoryProps

export default meta
