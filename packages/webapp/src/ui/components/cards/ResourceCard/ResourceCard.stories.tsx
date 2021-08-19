import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { ResourceCard, ResourceCardProps } from './ResourceCard'

const meta: ComponentMeta<typeof ResourceCard> = {
  title: 'Components/Cards/ResourceCard',
  component: ResourceCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['ResourceCardStoryProps', 'ResourceCardLoggedOutStoryProps', 'ResourceCardLoggedInStoryProps'],
  decorators: [
    Story => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

export const ResourceCardStoryProps: ResourceCardProps = {
  tags: ['Reforestationg', 'Drones', 'Soil', 'Agroforestry'],
  title: 'Best Resource Ever Forever',
  image: 'https://picsum.photos/200/100',
  type: 'Video',
  resourceHomeHref: href('Pages/Resource/LoggedIn'),
  isAuthenticated: true,
  bookmarked: false,
  liked: false,
  numLikes: 23
}

export const ResourceCardLoggedInStoryProps: ResourceCardProps = {
  ...ResourceCardStoryProps
}

export const ResourceCardLoggedOutStoryProps: ResourceCardProps = {
  ...ResourceCardStoryProps,
  isAuthenticated: false
}

const ResourceCardStory: ComponentStory<typeof ResourceCard> = args => <ResourceCard {...args} />

export const LoggedIn = ResourceCardStory.bind({})
LoggedIn.args = ResourceCardLoggedInStoryProps

export const LoggedOut = ResourceCardStory.bind({})
LoggedOut.args = ResourceCardLoggedOutStoryProps

export default meta
