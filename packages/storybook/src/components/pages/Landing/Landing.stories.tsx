import { Landing, LandingProps } from '@moodlenet/react-app/ui'
import { ResourceCardList } from '@moodlenet/resource/ui'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import {
  MainLayoutLoggedInStoryProps,
  MainLayoutLoggedOutStoryProps,
} from '../../layout/MainLayout/MainLayout.stories.js'
import { getResourceCardStoryProps } from '../Collection/stories-props.js'
// import { href } from '../../../elements/link'

const meta: ComponentMeta<typeof Landing> = {
  title: 'Pages/Landing',
  component: Landing,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['LandingLoggedOutStoryProps', 'LandingLoggedInStoryProps'],
}

export const LandingLoggedOutStoryProps: LandingProps = {
  mainLayoutProps: MainLayoutLoggedOutStoryProps,
  title: 'Find, share and curate open educational resources',
  subtitle: 'Search for resources, subjects, collections or people',
  // mainColumnItems: [
  //   {
  //     Item: () => (
  //       <ResourceCardList
  //         resourceCardPropsList={getResourceCardStoryProps(15, {
  //           isAuthenticated: false,
  //         })}
  //       />
  //     ),
  //     key: 'resource-card-list',
  //   },
  // ],
}

export const LandingLoggedInStoryProps: LandingProps = {
  ...LandingLoggedOutStoryProps,
  mainLayoutProps: MainLayoutLoggedInStoryProps,
  mainColumnItems: [
    {
      Item: () => <ResourceCardList resourceCardPropsList={getResourceCardStoryProps(8, {})} />,
      key: 'resource-card-list',
    },
  ],
}

type LandingStory = ComponentStory<typeof Landing>

export const LoggedOut: LandingStory = () => {
  const props = {
    ...LandingLoggedOutStoryProps,
  }
  return <Landing {...props} />
}

export const LoggedIn: LandingStory = () => {
  const props = {
    ...LandingLoggedInStoryProps,
  }
  return <Landing {...props} />
}

export const Owner: LandingStory = () => {
  const props = {
    ...LandingLoggedInStoryProps,
    mainColumnItems: [
      {
        Item: () => (
          <ResourceCardList
            resourceCardPropsList={getResourceCardStoryProps(15, {
              isOwner: true,
            })}
          />
        ),
        key: 'resource-card-list',
      },
    ],
  }
  return <Landing {...props} />
}

export default meta
