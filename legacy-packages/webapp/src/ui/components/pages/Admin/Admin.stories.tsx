import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CSSProperties, useState } from 'react'
import { BaseStyleType } from '../../../styles/config'
import { StyleContextDefault, StyleProvider } from '../../../styles/Style'
import { HeaderPageTemplateLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { AccountStoryProps } from './Account/Account.stories'
import { Admin, AdminProps } from './Admin'
import { AppearanceStoryProps } from './Appearance/Appearance.stories'

const meta: ComponentMeta<typeof Admin> = {
  title: 'Pages/Admin',
  component: Admin,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['AdminStory'],
  decorators: [
    (Story) => {
      const [style, setStyle] = useState<BaseStyleType & CSSProperties>(
        StyleContextDefault.style
      )
      return (
        <StyleProvider value={{ style, setStyle }}>
          <Story />
        </StyleProvider>
      )
    },
  ],
}

type AdminStory = ComponentStory<typeof Admin>

export const Account: AdminStory = () => {
  const props: AdminProps = {
    headerPageTemplateProps: HeaderPageTemplateLoggedInStoryProps,
    sectionProps: AccountStoryProps,
    section: 'Account',
  }
  return <Admin {...props} />
}

export const Appearance: AdminStory = () => {
  const props: AdminProps = {
    headerPageTemplateProps: HeaderPageTemplateLoggedInStoryProps,
    sectionProps: AppearanceStoryProps,
    section: 'Appearance',
  }
  return <Admin {...props} />
}

export default meta
