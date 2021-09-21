import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { ContributorCard, ContributorCardProps } from './ContributorCard'

const meta: ComponentMeta<typeof ContributorCard> = {
  title: 'Pages/Resource/ContributorCard',
  component: ContributorCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['ContributorCardStoryProps', 'Default'],
  decorators:[
    (Story)=>(<div style={{height:100,width:300}}><Story/></div>)
  ]
}

export const ContributorCardStoryProps: ContributorCardProps = {
  avatarUrl: 'https://uifaces.co/our-content/donated/1H_7AxP0.jpg',
  displayName: 'Juanito Rodriguez',
  timeSinceCreation: '4 hours ago',
  creatorProfileHref: href('Pages/Profile/LoggedIn')
}

const ContributorCardStory: ComponentStory<typeof ContributorCard> = args => <ContributorCard {...args} />

export const Default = ContributorCardStory.bind({})
Default.args = ContributorCardStoryProps

export default meta
