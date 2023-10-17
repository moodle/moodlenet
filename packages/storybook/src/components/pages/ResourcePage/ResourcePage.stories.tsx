// import type { ResourcePageProps } from '@moodlenet/ed-resource/ui'
// import { ResourcePage } from '@moodlenet/ed-resource/ui'
// import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
// import { useResourcePageStoryProps } from './ResourcePageProps.stories.js'

// const meta: ComponentMeta<typeof ResourcePage> = {
//   title: 'Pages/ResourcePage',
//   component: ResourcePage,
// }
// export default meta

// // More on nent templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// type ResourcePageStory = ComponentStory<typeof ResourcePage>

// export const LoggedOut: ResourcePageStory = () => {
//   const props: ResourcePageProps = useResourcePageStoryProps({
//     flow: {
//       dispatch: props => {
//         console.log(props)
//       },
//       state: {
//         activity: 'View resource',
//         type: 'Viewing resource',
//         // {
//         //   error: {
//         //     type: 'file too big',
//         //   },
//         // },
//       },
//     },
//     isAuthenticated: false,
//   })

//   return <ResourcePage {...props} />
// }

// export const Create: ResourcePageStory = () => {
//   const props: ResourcePageProps = useResourcePageStoryProps({
//     flow: {
//       dispatch: props => {
//         console.log(props)
//       },
//       state: {
//         activity: 'Create resource',
//         type: 'Choose content',
//         choosenContent: 'http://asd.asd',
//         acceptableContentRules: {
//           file: {
//             maxSizeBytes: 1000000,
//           },
//           link: {
//             ruleDescription: 'asd',
//           },
//         },
//         choosenContentErrors: null,
//         // {
//         //   error: {
//         //     type: 'file too big',
//         //   },
//         // },
//       },
//     },
//   })
//   return <ResourcePage {...props} />
// }

// export const Edit: ResourcePageStory = () => {
//   const props: ResourcePageProps = useResourcePageStoryProps({
//     flow: {
//       dispatch: props => {
//         console.log(props)
//       },
//       state: {
//         activity: 'Edit resource',
//         type: 'Editing resource',
//         editingResourceDocument: {
//           title: 'asd',
//           subject: 'asd',
//         },
//         resourceDocument: {
//           title: 'asd',
//           subject: 'asd',
//         },
//         editResourceErrors: {
//           subject: undefined,
//         },
//         options: {
//           subjects: [
//             {
//               label: 'Mathematics',
//               value: 'mathematics',
//             },
//             {
//               label: 'Science',
//               value: 'science',
//             },
//           ],
//         },
//       },
//     },
//   })

//   return <ResourcePage {...props} />
// }

// export const View: ResourcePageStory = () => {
//   const props: ResourcePageProps = useResourcePageStoryProps({
//     flow: {
//       dispatch: props => {
//         console.log(props)
//       },
//       state: {
//         activity: 'View resource',
//         type: 'Viewing resource',
//       },
//     },
//   })

//   return <ResourcePage {...props} />
// }
