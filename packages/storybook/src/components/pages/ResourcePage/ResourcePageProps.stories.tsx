// import { overrideDeep } from '@moodlenet/component-library/common'
// import type { ResourceFormProps } from '@moodlenet/ed-resource/common'
// import { getValidationSchemas } from '@moodlenet/ed-resource/common'
// import { action } from '@storybook/addon-actions'
// import type { Meta as ComponentMeta } from '@storybook/react'
// import type { PartialDeep } from 'type-fest'
// // import { useEffect } from 'react'
// import type { AnySchema } from 'yup'
// import { addMethod, MixedSchema } from 'yup'
// // import { href } from '../../../elements/link'

// // import {
// // import { Resource, ResourceProps } from '@moodlenet/ed-resource/ui'
// // import { useFormik } from 'formik'
// import { FieldsDataStories } from '@moodlenet/ed-meta/stories'
// import type {
//   CreateResourceActivityState,
//   EditResourceActivityState,
//   MainResourceCardSlots,
//   ResourcePageProps,
//   ViewResourceActivityState,
// } from '@moodlenet/ed-resource/ui'
// import { Resource } from '@moodlenet/ed-resource/ui'

// import type { BookmarkButtonProps, LikeButtonProps } from '@moodlenet/web-user/ui'
// import { useFormik } from 'formik'
// import {
//   MainLayoutLoggedInStoryProps,
//   MainLayoutLoggedOutStoryProps,
// } from '../../layout/MainLayout/MainLayout.stories.js'

// import { useState } from 'react'
// import { learningOutcomesSelection } from './ResourcePageData.stories.props.js'

// const meta: ComponentMeta<typeof Resource> = {
//   title: 'Pages/ResourcePage',
//   component: Resource,
//   argTypes: {
//     // backgroundColor: { control: 'color' },
//   },
//   parameters: { layout: 'fullscreen' },
//   excludeStories: [
//     'ResourcePageFormProps',
//     'ResourcePageStoryProps',
//     'resourceFormBag',
//     'ResourceStoryProps',
//     'ResourceLinkLoggedOutStoryProps',
//     'ResourceFileLoggedOutStoryProps',
//     'ResourceLoggedInStoryProps',
//     'ResourceOwnerStoryProps',
//     'ResourceAdminStoryProps',
//     'validationSchema',
//     'useResourcePageForm',
//     'useResourcePageStoryProps',
//     'CollectionTextOptionProps',
//     'ResourcePageFormValues',
//   ],
// }

// addMethod(MixedSchema, 'oneOfSchemas', function (schemas: AnySchema[]) {
//   return this.test(
//     'one-of-schemas',
//     'Not all items in ${path} match one of the allowed schemas',
//     item => schemas.some(schema => schema.isValidSync(item, { strict: true })),
//   )
// })

// export const ResourcePageFormValues: ResourceFormProps = {
//   title: '',
//   description:
//     'Earth 2020: An Insider’s Guide to a Rapidly Changing Planet responds to a public increasingly concerned about the deterioration of Earth’s natural systems, offering readers a wealth of perspectives on our shared ecological past, and on the future trajectory of planet Earth. Written by world-leading thinkers on the front-lines of global change research and policy, this multi-disciplinary collection maintains a dual focus: some essays investigate specific facets of the physical Earth system, while others explore the social, legal and political dimensions shaping the human environmental footprint. In doing so, the essays collectively highlight the urgent need for collaboration across diverse domains of expertise in addressing one of the most significant challenges facing us today. Earth 2020 is essential reading for everyone seeking a deeper understanding of the past, present and future of our planet, and the role of humanity in shaping this trajectory.',
//   subject: FieldsDataStories.SubjectsTextOptionProps[2]?.value ?? '',
//   language: FieldsDataStories.LanguagesTextOptionProps[2]?.value ?? '',
//   level: FieldsDataStories.LevelTextOptionProps[2]?.value ?? '',
//   license: FieldsDataStories.LicenseIconTextOptionProps[2]?.value ?? '',
//   month: FieldsDataStories.MonthTextOptionProps[8]?.value ?? '',
//   year: FieldsDataStories.YearsProps[20]?.valueOf() ?? '',
//   type: FieldsDataStories.TypeTextOptionProps[1]?.value ?? '',
//   learningOutcomes: learningOutcomesSelection,
// }

// export const useResourcePageForm = (overrides?: Partial<ResourceFormProps>) => {
//   return useFormik<ResourceFormProps>({
//     validationSchema: getValidationSchemas({
//       contentMaxUploadSize: 1000000000,
//       imageMaxUploadSize: 1000000000,
//     }).publishedResourceValidationSchema,
//     onSubmit: action('submit edit'),
//     initialValues: {
//       title: 'Best resource ever',
//       description:
//         'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
//       subject: '',
//       license: '',
//       type: '',
//       language: '',
//       level: '',
//       month: '',
//       year: '',
//       learningOutcomes: [],
//     },
//     ...overrides,
//   })
// }

// // export const CollectionTextOptionProps: OptionItemProp[] = [
// //   { label: 'Education', value: 'Education' },
// //   { label: 'Biology', value: 'Biology' },
// //   { label: 'Algebra', value: 'Algebra' },
// //   { label: 'Phycology', value: 'Phycology' },
// //   { label: 'Phylosophy', value: 'Phylosophy' },
// //   { label: 'Sociology', value: 'Sociology' },
// //   { label: 'English Literature', value: 'English Literature' },
// // ]

// export const useResourcePageStoryProps = (
//   overrides?: PartialDeep<
//     ResourcePageProps & {
//       isAuthenticated: boolean
//       bookmarkButtonProps: BookmarkButtonProps
//       likeButtonProps: LikeButtonProps
//     }
//   >,
//   //   {
//   //   props?: Partial<ResourceProps>
//   //   resource?: Partial<ResourceType>
//   //   resourceForm?: Partial<ResourceFormProps>
//   //   actions?: Partial<ResourceActions>
//   //   access?: Partial<ResourceAccess>
//   //   mainResourceCardSlots?: Partial<MainResourceCardSlots>
//   // }
// ): ResourcePageProps => {
//   const isAuthenticated = overrides?.isAuthenticated ?? true
//   const [activity, setActivity] = useState<ResourcePageProps['flow']['state']['activity']>(
//     overrides?.flow?.state?.activity ?? 'Create resource',
//   )
//   const [type, setType] = useState<ResourcePageProps['flow']['state']['type']>(
//     overrides?.flow?.state?.type ?? 'Choose content',
//   )
//   const [dispatch, setDispatch] = useState<ResourcePageProps['flow']['dispatch']>(
//     overrides?.flow?.dispatch ?? (() => undefined),
//   )
//   const [createState, setCreateState] = useState<CreateResourceActivityState>()
//   const [editState, setEditState] = useState<EditResourceActivityState>()
//   const [viewState, setViewState] = useState<ViewResourceActivityState>()

//   const state: CreateResourceActivityState | EditResourceActivityState | ViewResourceActivityState =
//     activity === 'Create resource' && createState
//       ? createState
//       : activity === 'Edit resource' && editState
//       ? editState
//       : activity === 'View resource' && viewState
//       ? viewState
//       : {
//           activity: 'Create resource',
//           type: 'Choose content',
//           choosenContent: null,
//           acceptableContentRules: {
//             file: {
//               maxSizeBytes: 1000000,
//             },
//             link: {
//               ruleDescription: 'asd',
//             },
//           },
//           choosenContentErrors: null,
//         }

//   const mainResourceCardSlots: MainResourceCardSlots = {
//     mainColumnItems: [],
//     headerColumnItems: [],
//     topLeftHeaderItems: [],
//     topRightHeaderItems: [
//       // isPublished
//       //   ? {
//       //       Item: () => <LikeButton {...likeButtonProps} />,
//       //       key: 'like-button',
//       //     }
//       //   : null,
//       // isPublished
//       //   ? {
//       //       Item: () => <BookmarkButton {...bookmarkButtonProps} />,
//       //       key: 'bookmark-button',
//       //     }
//       //   : null,
//     ],
//     moreButtonItems: [],
//     footerRowItems: [],
//     uploadOptionsItems: [
//       // {
//       //   Item: () => <Unsplash />,
//       //   key: 'unsplash-open-button',
//       // },
//     ],
//   }

//   return overrideDeep<ResourcePageProps>(
//     {
//       flow: {
//         dispatch: dispatch,
//         state: state,
//       },
//       mainLayoutProps: isAuthenticated
//         ? MainLayoutLoggedInStoryProps
//         : MainLayoutLoggedOutStoryProps,
//       wideColumnItems: [],
//       mainColumnItems: [],
//       rightColumnItems: [],
//       extraDetailsItems: [],
//       mainResourceCardSlots: mainResourceCardSlots,

//       // generalActionsItems: generalActionsItems,
//       // mainResourceCardSlots: mainResourceCardSlots,
//       // resourceContributorCardProps:
//       // ResourceContributorCardStories.ResourceContributorCardStoryProps,

//       //   data: data,
//       //   resourceForm: formData,
//       //   state: state,
//       //   actions: actions,
//       //   access: access,
//       //   edMetaOptions: edMetaOptions,

//       //   validationSchemas: getValidationSchemas({
//       //     contentMaxUploadSize: 1024 * 1024 * 1024,
//       //     imageMaxUploadSize: 1024 * 1024 * 25,
//       //   }),

//       //   extraDetailsItems: extraDetailsItems,

//       //   fileMaxSize: 343243,
//       //   saveState: saveState,
//     },
//     overrides,
//   )
// }

// export default meta
