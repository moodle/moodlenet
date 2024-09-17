import { Subject } from '@moodlenet/ed-meta/ui'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { useSubjectStoryProps } from './SubjectProps.stories'
// import { href } from '../../../elements/link'

const meta: ComponentMeta<typeof Subject> = {
  title: 'Pages/Subject',
  component: Subject,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['SubjectLoggedOutStoryProps', 'SubjectLoggedInStoryProps'],
}

type SubjectStory = ComponentStory<typeof Subject>

export const LoggedOut: SubjectStory = () => {
  const props = useSubjectStoryProps({
    isAuthenticated: false,
  })

  return <Subject {...props} />
}

export const LoggedIn: SubjectStory = () => {
  const props = useSubjectStoryProps({})

  return <Subject {...props} />
}

export default meta
