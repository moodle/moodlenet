// import { ComponentMeta, ComponentStory } from '@storybook/react'
// // import { href } from '../../../../elements/link'
// import { MainFooter, MainFooterProps } from '@moodlenet/react-app/ui'
// import { ReactComponent as PoweredByMoodleNet } from '../../../../../../public/powered-by-moodlenet.svg'

// const meta: ComponentMeta<typeof MainFooter> = {
//   title: 'Organisms/Footer',
//   component: MainFooter,
//   argTypes: {
//     // backgroundColor: { control: 'color' },
//   },
//   excludeStories: ['FooterStoryProps'],
//   decorators: [
//     Story => (
//       <div style={{ alignItems: 'flex-start', width: '100%', height: '100%' }}>
//         <Story />
//       </div>
//     ),
//   ],
// }

// export const FooterStoryProps: MainFooterProps = {
//   leftItems: [],
//   centerItems: [
//     {
//       Item: PoweredByMoodleNet,
//       key: 'powered-by-moodlenet',
//     },
//   ],
//   rightItems: [],
// }

// const FooterStory: ComponentStory<typeof MainFooter> = args => <MainFooter {...args} />

// export const Default: typeof FooterStory = FooterStory.bind({})
// Default.args = FooterStoryProps

// export default meta
