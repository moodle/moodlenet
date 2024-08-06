import { href } from '@moodlenet/react-app/common'
import { MinimalisticHeaderStories } from '@moodlenet/react-app/stories'
import type { UserAgreementProps } from '@moodlenet/web-user/ui'
import { UserAgreement } from '@moodlenet/web-user/ui'
import { MinimalisticAccessButtonsStories } from '@moodlenet/web-user/stories'
import type { Meta as ComponentMeta } from '@storybook/react'
import { FooterStoryProps } from '../../../organisms/Footer/Footer.stories.js'

const meta: ComponentMeta<typeof UserAgreement> = {
  title: 'Pages/Policies/UserAgreement',
  component: UserAgreement,
  parameters: { layout: 'fullscreen' },
  excludeStories: ['userAgreementStoryProps'],
}

export const userAgreementStoryProps: UserAgreementProps = {
  footerProps: FooterStoryProps,
  headerProps: MinimalisticHeaderStories.MinimalisticHeaderStoryProps(
    MinimalisticAccessButtonsStories.getMinimalisticAccessHeaderItems({
      loginHref: href('Pages/Access/Login/Default'),
      signupHref: href('Pages/Access/SignUp/Default'),
      showLearnMoreButton: true,
      showLoginButton: false,
      showSignupButton: true,
    }),
  ),
}

export const Default = () => {
  return <UserAgreement {...userAgreementStoryProps} />
}

export default meta
