import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ProfileCard, ProfileCardProps } from './ProfileCard'

const meta: ComponentMeta<typeof ProfileCard> = {
  title: 'Components/Cards/ProfileCard',
  component: ProfileCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['ProfileCardStoryProps'],
  decorators:[
    (Story)=>(<div style={{maxWidth:500}}><Story/></div>)
  ]
}

export const ProfileCardStoryProps: ProfileCardProps = {
  backgroundUrl: 'https://picsum.photos/200/100',
  username: 'juanito',
  avatarUrl: 'https://uifaces.co/our-content/donated/1H_7AxP0.jpg',
  firstName: 'Juanito',
  lastName: 'Rodriguez',
  organizationName: 'UM',
  location: 'Malta',
  siteUrl: 'https://iuri.is/',
  description: 'Italian biologist specialized in endangered rainforest monitoring. Cooperating with local organizations to improve nature reserves politics.'
}

const ProfileCardStory: ComponentStory<typeof ProfileCard> = args => <ProfileCard {...args} />

export const Default = ProfileCardStory.bind({})
Default.args = ProfileCardStoryProps

export default meta
