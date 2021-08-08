import { ComponentMeta, ComponentStory } from '@storybook/react'
import { HeaderLoggedOutStoryProps } from '../../components/Header/Header.stories'
import { SubHeaderStoryProps } from '../../components/SubHeader/SubHeader.stories'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { ContributorCardStoryProps } from './ContributorCard/ContributorCard.stories'
import { InfoCardStoryProps } from './InfoCard/InfoCard.stories'
import { Resource, ResourceProps } from './Resource'

const meta: ComponentMeta<typeof Resource> = {
  title: 'Pages/Resource',
  component: Resource,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['ResourceStoryProps', 'ResourceLoggedOutStoryProps', 'ResourceLoggedInStoryProps'],
}

const ResourceStory: ComponentStory<typeof Resource> = args => <Resource {...args} />

export const ResourceStoryProps: ResourceProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
  },
  imageUrl: 'https://picsum.photos/200/100',
  title: "My Best Resource",
  description: 'This is the description that tells you that this a not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
  liked: false,
  infoCardProps: InfoCardStoryProps,
  contributorCardProps: ContributorCardStoryProps

}

export const ResourceLoggedOutStoryProps: ResourceProps = {
  ...ResourceStoryProps,
  headerPageTemplateProps: {
    isAuthenticated: false,
    headerPageProps: {
      isAuthenticated: false,
      headerProps: {
        ...HeaderLoggedOutStoryProps,
        me: null,
      },
      subHeaderProps: {
        tags: [],
      },
    },
  },
}

export const ResourceLoggedInStoryProps: ResourceProps = {
  ...ResourceStoryProps,
  headerPageTemplateProps: {
    isAuthenticated: true,
    headerPageProps: {
      isAuthenticated: true,
      headerProps: HeaderLoggedOutStoryProps,
      subHeaderProps: SubHeaderStoryProps,
    },
  },
}

export const LoggedOut = ResourceStory.bind({})
LoggedOut.args = ResourceLoggedOutStoryProps

export const LoggedIn = ResourceStory.bind({})
LoggedIn.args = ResourceLoggedInStoryProps

export default meta
