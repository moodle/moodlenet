import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CollectionCardStoryProps } from '../../components/cards/CollectionCard/CollectionCard.stories'
import { OverallCardStoryProps } from '../../components/cards/OverallCard/OverallCard.stories'
import { ResourceCardStoryProps } from '../../components/cards/ResourceCard/ResourceCard.stories'
import { HeaderLoggedOutStoryProps } from '../../components/Header/Header.stories'
import { SubHeaderStoryProps } from '../../components/SubHeader/SubHeader.stories'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { NewResource, NewResourceProps } from './NewResource'
import { UploadResourceStoryProps } from './UploadResource/UploadResource.stories'

const meta: ComponentMeta<typeof NewResource> = {
  title: 'Pages/New Resource',
  component: NewResource,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['NewResourceStoryProps', 'NewResourceLoggedOutStoryProps', 'NewResourceLoggedInStoryProps'],
}

const NewResourceStory: ComponentStory<typeof NewResource> = args => <NewResource {...args} />

export const NewResourceStoryProps: NewResourceProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
  },
  overallCardProps: OverallCardStoryProps,
  // scoreCardProps: ScoreCardStoryProps,
  collectionCardPropsList: [CollectionCardStoryProps, CollectionCardStoryProps],
  resourceCardPropsList: [ResourceCardStoryProps, ResourceCardStoryProps, ResourceCardStoryProps],
  uploadResource: UploadResourceStoryProps,
  username: 'Juanito',
}

export const NewResourceLoggedOutStoryProps: NewResourceProps = {
  ...NewResourceStoryProps,
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

export const NewResourceLoggedInStoryProps: NewResourceProps = {
  ...NewResourceStoryProps,
  headerPageTemplateProps: {
    isAuthenticated: true,
    headerPageProps: {
      isAuthenticated: true,
      headerProps: HeaderLoggedOutStoryProps,
      subHeaderProps: SubHeaderStoryProps,
    },
  },
}

export const LoggedOut = NewResourceStory.bind({})
LoggedOut.args = NewResourceLoggedOutStoryProps

export const LoggedIn = NewResourceStory.bind({})
LoggedIn.args = NewResourceLoggedInStoryProps

export default meta
