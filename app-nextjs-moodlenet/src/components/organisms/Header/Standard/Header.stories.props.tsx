"use client"
// import { ComponentMeta, ComponentStory } from '@storybook/react'
// // import { href } from '../../../../elements/link'
// import { HeaderTitleStories } from '@moodlenet/react-app/stories'
// import { MainHeader, MainHeaderProps } from '@moodlenet/react-app/ui'
// import Header, { HeaderProps } from './Header.js'

// const meta: ComponentMeta<typeof Header> = {
//   title: 'Organisms/Header',
//   component: Header,
//   argTypes: {
//     // backgroundColor: { control: 'color' },
//   },
//   excludeStories: [
//     'MainHeaderStoryProps',
//     'HeaderLoggedOutStoryProps',
//     'HeaderLoggedOutOrganizationStoryProps',
//     'HeaderLoggedInStoryProps',
//   ],
//   decorators: [
//     Story => (
//       <div style={{ alignItems: 'flex-start', width: '100%', height: '100%' }}>
//         <Story />
//       </div>
//     ),
//   ],
// }

// const HeaderStoryProps: HeaderProps = {
//   leftItems: [],
//   centerItems: [],
//   rightItems: [],
//   // logout: action('logout'),
//   // avatarUrl:
//   //   'https://images.pexels.com/photos/3746326/pexels-photo-3746326.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200',
//   // avatarMenuItems: [
//   //   HeaderStories.HeaderProfileStoryProps,
//   //   {
//   //     Icon: HeaderSettingsProps.Icon,
//   //     Text: HeaderSettingsProps.Text,
//   //     ClassName: HeaderSettingsProps.ClassName,
//   //     Position: HeaderSettingsProps.Position,
//   //     Path: HeaderSettingsProps.Path,
//   //   },
//   // ],
// }

// export const HeaderLoggedOutStoryProps: MainHeaderProps = {
//   ...HeaderStoryProps,
//   leftItems: [],
//   centerItems: [],
//   rightItems: [],
//   headerTitleProps: HeaderTitleStories.HeaderTitleStoryProps,
// }

// export const HeaderLoggedOutOrganizationStoryProps: MainHeaderProps = {
//   ...HeaderLoggedOutStoryProps,
//   headerTitleProps: HeaderTitleStories.HeaderTitleOrganizationStoryProps,
// }

// export const HeaderLoggedInStoryProps: MainHeaderProps = {
//   ...HeaderLoggedOutStoryProps,
//   headerTitleProps: HeaderTitleStories.HeaderTitleStoryProps,
//   isAuthenticated: true,
// }

// const HeaderStory: ComponentStory<typeof MainHeader> = args => <MainHeader {...args} />

// export const LoggedOut: typeof HeaderStory = HeaderStory.bind({})
// LoggedOut.args = HeaderLoggedOutStoryProps

// export const OrganizationLoggedOut: typeof HeaderStory = HeaderStory.bind({})
// OrganizationLoggedOut.args = HeaderLoggedOutOrganizationStoryProps

// export const LoggedIn: typeof HeaderStory = HeaderStory.bind({})
// LoggedIn.args = HeaderLoggedInStoryProps

// export default meta
