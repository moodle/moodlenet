// import { action } from '@storybook/addon-actions'
// import { ComponentMeta } from '@storybook/react'
// import { useFormik } from 'formik'
// import { AddToCollectionsCard, OptionItem } from './AddToCollectionsCard'

// const meta: ComponentMeta<typeof AddToCollectionsCard> = {
//   title: 'Molecules/AddToCollectionsCard',
//   component: AddToCollectionsCard,
//   argTypes: {
//     // backgroundColor: { control: 'color' },
//   },
//   excludeStories: ['AddToCollectionsCardStoryProps'],
//   decorators: [
//     (Story) => (
//       <div style={{ maxWidth: 1100 }}>
//         <Story />
//       </div>
//     ),
//   ],
// }

// const collections = [
//   'Education',
//   'Biology',
//   'Algebra',
//   'Phycology',
//   'Phylosophy',
//   'Sociology',
//   'English Literature',
// ]
// export const Default = () => {
//   const form = useFormik<{ collections?: string[] }>({
//     initialValues: { collections: collections.slice(3, 5) },
//     onSubmit: action('submit'),
//   })

//   return (
//     <AddToCollectionsCard
//       name="collections"
//       multiple
//       value={form.values.collections}
//       onChange={form.handleChange}
//     >
//       {collections.map((label) => (
//         <OptionItem key={label} label={label} value={label} />
//       ))}
//     </AddToCollectionsCard>
//   )
// }

// export default meta
