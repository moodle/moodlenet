import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CollectionCardStoryProps } from '../../components/cards/CollectionCard/CollectionCard.stories'
import { ResourceCardStoryProps } from '../../components/cards/ResourceCard/ResourceCard.stories'
import { SubjectCardProps } from '../../components/cards/SubjectCard/SubjectCard'
import { SubjectCardStoryProps } from '../../components/cards/SubjectCard/SubjectCard.stories'
import { Browser, BrowserProps } from './Browser'

const meta: ComponentMeta<typeof Browser> = {
  title: 'Components/Browser',
  component: Browser,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['BrowserStoryProps', 'BrowserLoggedOutStoryProps', 'BrowserLoggedInStoryProps'],
  decorators:[
    (Story)=>(<div style={{margin: '50px'}}><Story/></div>)
  ]
}

const BrowserStory: ComponentStory<typeof Browser> = args => <Browser {...args} />

const subjectCardPropsList: SubjectCardProps[] = [
  '#Education',
  '#Forestry',
  'Enviromental Science with a lot of Mathematics and Physics',
  'Sailing Principles',
  'Latin',
  'Hebrew',
  'NoShow',
].map(x => ({ organization: { ...SubjectCardStoryProps }.organization, title: x }))

export const BrowserStoryProps: BrowserProps = {
  setSortBy: action(`set sort by`),
  subjectCardPropsList: subjectCardPropsList,
  collectionCardPropsList: [
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
  ],
  resourceCardPropsList: [ResourceCardStoryProps, ResourceCardStoryProps, ResourceCardStoryProps],
}

export const Default = BrowserStory.bind({})
Default.args = BrowserStoryProps

export default meta
