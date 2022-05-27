// import { ComponentMeta, ComponentStory } from '@storybook/react'
// import { CSSProperties, useState } from 'react'
// import { BaseStyleType } from '../../../styles/config'
// import { StyleContextDefault, StyleProvider } from '../../../styles/Style'
// import { HeaderPageTemplateLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
// import { AccountStoryProps } from './Account/Account.stories'
// import { Packages, PackagesProps } from './Packages'
// import { AppearanceStoryProps } from './Appearance/Appearance.stories'

// const meta: ComponentMeta<typeof Packages> = {
//   title: 'Pages/Packages',
//   component: Packages,
//   argTypes: {
//     // backgroundColor: { control: 'color' },
//   },
//   parameters: { layout: 'fullscreen' },
//   excludeStories: ['PackagesStory'],
//   decorators: [
//     (Story) => {
//       const [style, setStyle] = useState<BaseStyleType & CSSProperties>(
//         StyleContextDefault.style
//       )
//       return (
//         <StyleProvider value={{ style, setStyle }}>
//           <Story />
//         </StyleProvider>
//       )
//     },
//   ],
// }

// type PackagesStory = ComponentStory<typeof Packages>

// export const Account: PackagesStory = () => {
//   const props: PackagesProps = {
//     headerPageTemplateProps: HeaderPageTemplateLoggedInStoryProps,
//     sectionProps: AccountStoryProps,
//     section: 'Account',
//   }
//   return <Packages {...props} />
// }

// export const Appearance: PackagesStory = () => {
//   const props: PackagesProps = {
//     headerPageTemplateProps: HeaderPageTemplateLoggedInStoryProps,
//     sectionProps: AppearanceStoryProps,
//     section: 'Appearance',
//   }
//   return <Packages {...props} />
// }

// export default meta
