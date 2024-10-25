import { href } from '@moodlenet/react-app/common'
import { MinimalisticHeaderStories } from '@moodlenet/react-app/stories'
import { MinimalisticAccessButtonsStories } from '@moodlenet/web-user/stories'
import type { DeleteAccountSuccessProps } from '@moodlenet/web-user/ui'
import { DeleteAccountSuccess } from '@moodlenet/web-user/ui'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { FooterStoryProps } from '../../organisms/Footer/Footer.stories'

const meta: ComponentMeta<typeof DeleteAccountSuccess> = {
  title: 'Pages/Access/DeleteAccountSuccess',
  component: DeleteAccountSuccess,
  excludeStories: ['DeleteAccountSuccessStory', 'DeleteAccountSuccessStoryProps'],
  parameters: {
    layout: 'fullscreen',
  },
}

export const DeleteAccountSuccessStoryProps: DeleteAccountSuccessProps = {
  headerProps: MinimalisticHeaderStories.MinimalisticHeaderStoryProps(
    MinimalisticAccessButtonsStories.getMinimalisticAccessHeaderItems({
      showLoginButton: true,
      loginHref: href('Pages/Access/Login/Default'),
      showSignupButton: false,
      signupHref: href('Pages/Access/Signup/Default'),
      showLearnMoreButton: true,
    }),
  ),
  footerProps: FooterStoryProps,
}

export const DeleteAccountSuccessStory: ComponentStory<typeof DeleteAccountSuccess> = args => (
  <DeleteAccountSuccess {...args} />
)

export const Default: typeof DeleteAccountSuccessStory = DeleteAccountSuccessStory.bind({})
Default.args = DeleteAccountSuccessStoryProps

export default meta
