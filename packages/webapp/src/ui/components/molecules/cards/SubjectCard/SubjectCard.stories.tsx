import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../../elements/link'
import SubjectCard, { SubjectCardProps } from './SubjectCard'

const meta: ComponentMeta<typeof SubjectCard> = {
  title: 'Molecules/SubjectCard',
  component: SubjectCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['SubjectCardStoryProps'],
  decorators: [
    (Story) => (
      <div style={{ height: 100, width: 'auto' }}>
        <Story />
      </div>
    ),
  ],
}

export const SubjectCardStoryProps: SubjectCardProps = {
  title: 'Latest resources',
  organization: {
    url: 'uws.edu',
    color: '#40E3A4',
  },
  subjectHomeHref: href('Subject/home'),
}

const SubjectCardStory: ComponentStory<typeof SubjectCard> = (args) => (
  <SubjectCard {...args} />
)

export const Default = SubjectCardStory.bind({})
Default.args = SubjectCardStoryProps

export default meta
