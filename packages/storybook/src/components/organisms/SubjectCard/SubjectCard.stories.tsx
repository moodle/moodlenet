import { FilterNone, PermIdentity } from '@material-ui/icons'
import { overrideDeep } from '@moodlenet/component-library/common'
import type { SubjectCardProps } from '@moodlenet/ed-meta/ui'
import { SubjectCard } from '@moodlenet/ed-meta/ui'
import { href } from '@moodlenet/react-app/common'
import type { BookmarkButtonProps, SmallFollowButtonProps } from '@moodlenet/web-user/ui'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import type { PartialDeep } from 'type-fest'

const meta: ComponentMeta<typeof SubjectCard> = {
  title: 'Molecules/SubjectCard',
  component: SubjectCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['SubjectCardStoryProps', 'getSubjectCardStoryProps', 'SubjectCardStory'],
  decorators: [
    Story => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

export const getSubjectCardStoryProps = (
  overrides?: PartialDeep<
    SubjectCardProps & {
      isAuthenticated: boolean
      bookmarkButtonProps: BookmarkButtonProps
      smallFollowButtonProps: SmallFollowButtonProps
    }
  >,
): SubjectCardProps => {
  return overrideDeep<SubjectCardProps>(
    {
      mainColumnItems: [],
      overallItems: [
        {
          Icon: <PermIdentity />,
          key: 'followers',
          name: 'Followers',
          value: Math.floor(Math.random() * Math.random() * 1000),
        },
        {
          Icon: <FilterNone />,
          key: 'resources',
          name: 'Resources',
          value: Math.floor(Math.random() * Math.random() * 1000),
        },
      ],
      subjectHomeHref: href('Pages/Subject/Logged In'),
      title: 'Building and civil engineering',
    },
    overrides,
  )
}

export const SubjectCardStoryProps: SubjectCardProps = {
  ...getSubjectCardStoryProps(),
}

const SubjectCardStory: ComponentStory<typeof SubjectCard> = args => <SubjectCard {...args} />

export const Default = SubjectCardStory.bind({})
Default.args = SubjectCardStoryProps

export default meta
