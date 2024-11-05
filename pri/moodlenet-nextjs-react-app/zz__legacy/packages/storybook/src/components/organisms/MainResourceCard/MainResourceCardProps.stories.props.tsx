// import { action } from '@storybook/addon-actions'
// import { ComponentMeta } from '@storybook/react'
// // import { useEffect } from 'react'
// import { boolean, mixed, object, SchemaOf, string } from 'yup'
// // import { href } from '../../../elements/link'
// // import { TagListStory } from '../../../elements/tags'
// // import { HeaderLoggedOutStoryProps } from '../../organisms/Header/Header.stories'
// // import { HeaderPageTemplateProps } from '../../templates/HeaderPageTemplate'
// // import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
// // import { ResourceTextOptionProps } from '../NewResource/AddToResources/storiesData'
// import { OptionItemProp, TypeTextOptionProps } from '@moodlenet/component-library'
// // import {
// // import { Resource, ResourceProps } from '@moodlenet/ed-resource/ui'
// // import { useFormik } from 'formik'
// import { ResourceFormValues } from '@moodlenet/ed-resource/common'
// import { MainResourceCard, MainResourceCardProps, Resource } from '@moodlenet/ed-resource/ui'
// import { useResourceForm } from '../../../components/pages/Resource/Props.stories.props.mjs'
// const maxUploadSize = 1024 * 1024 * 50

// const meta: ComponentMeta<typeof Resource> = {
//   title: 'Pages/Resource',
//   component: Resource,
//   argTypes: {
//     // backgroundColor: { control: 'color' },
//   },
//   parameters: { layout: 'fullscreen' },
//   excludeStories: [
//     'resourceFormValues',
//     'ResourceStoryProps',
//     'resourceFormBag',
//     'ResourceStoryProps',
//     'ResourceLinkLoggedOutStoryProps',
//     'ResourceFileLoggedOutStoryProps',
//     'ResourceLoggedInStoryProps',
//     'ResourceOwnerStoryProps',
//     'ResourceAdminStoryProps',
//     'validationSchema',
//   ],
// }

// export const validationSchema: SchemaOf<ResourceFormValues> = object({
//   category: string().required(/* t */ `Please select a subject`),
//   content: string().required(/* t */ `Please upload a content`),
//   license: string().when('isFile', (isFile, schema) => {
//     return isFile ? schema.required(/* t */ `Select a license`) : schema.optional()
//   }),
//   isFile: boolean().required(),
//   description: string().max(4096).min(3).required(/* t */ `Please provide a description`),
//   name: string().max(160).min(3).required(/* t */ `Please provide a title`),
//   image: mixed()
//     .test((v, { createError }) =>
//       v instanceof Blob && v.size > maxUploadSize
//         ? createError({
//             message: /* t */ `The file is too big, reduce the size or provide a url`,
//           })
//         : true,
//     )
//     .optional(),
//   language: string().optional(),
//   level: string().optional(),
//   month: string().optional(),
//   type: string().optional(),
//   visibility: mixed().required(/* t */ `Visibility is required`),
//   year: string().when('month', (month, schema) => {
//     return month ? schema.required(/* t */ `Please select a year`) : schema.optional()
//   }),
// })
// export const resourceFormValues: ResourceFormValues = {
//   isFile: true,
//   // visibility: VisbilityIconTextOptionProps[0]!.value,
//   // category: CategoriesTextOptionProps[2]!.value,
//   content: '',
//   // description:
//   //   'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
//   description:
//     'Earth 2020: An Insider’s Guide to a Rapidly Changing Planet responds to a public increasingly concerned about the deterioration of Earth’s natural systems, offering readers a wealth of perspectives on our shared ecological past, and on the future trajectory of planet Earth. Written by world-leading thinkers on the front-lines of global change research and policy, this multi-disciplinary resource maintains a dual focus: some essays investigate specific facets of the physical Earth system, while others explore the social, legal and political dimensions shaping the human environmental footprint. In doing so, the essays collectively highlight the urgent need for collaboration across diverse domains of expertise in addressing one of the most significant challenges facing us today. Earth 2020 is essential reading for everyone seeking a deeper understanding of the past, present and future of our planet, and the role of humanity in shaping this trajectory.',
//   image: { location: 'https://picsum.photos/200/100' },
//   // language: LanguagesTextOptionProps[2]!.value,
//   // level: LevelTextOptionProps[2]!.value,
//   // license: LicenseIconTextOptionProps[2]!.value,
//   // month: MonthTextOptionProps[8]!.value,
//   // year: YearsProps[20],
//   name: '',
//   // name: 'The Best Resource Ever',
//   type: TypeTextOptionProps[2]!.value,
// }

// export const ResourceTextOptionProps: OptionItemProp[] = [
//   { label: 'Education', value: 'Education' },
//   { label: 'Biology', value: 'Biology' },
//   { label: 'Algebra', value: 'Algebra' },
//   { label: 'Phycology', value: 'Phycology' },
//   { label: 'Phylosophy', value: 'Phylosophy' },
//   { label: 'Sociology', value: 'Sociology' },
//   { label: 'English Literature', value: 'English Literature' },
// ]

// export const useMainResourceCardStoryProps = (overrides?: {
//   props?: Partial<MainResourceCardProps>
//   // formConfig?: Partial<FormikConfig<ResourceFormValues>>
//   resourceValues?: Partial<ResourceFormValues>
// }): MainResourceCardProps => {
//   const resource: ResourceFormValues = {
//     // validationSchema,
//     // onSubmit: action('submit edit'),
//     // initialValues: {
//     content: null,
//     isFile: true,
//     // visibility: 'Public',
//     name: 'Best resource ever',
//     description:
//       'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
//     // category: CategoriesTextOptionProps[2]!.value,
//     // language: LanguagesTextOptionProps[2]?.value,
//     // level: LevelTextOptionProps[2]?.value,
//     // license: LicenseIconTextOptionProps[2]?.value,
//     // month: MonthTextOptionProps[8]?.value,
//     // year: YearsProps[20],
//     type: TypeTextOptionProps[2]?.value,
//     image: {
//       location:
//         'https://images.unsplash.com/photo-1543964198-d54e4f0e44e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
//     },
//     ...overrides?.resourceValues,
//     // },
//     // ...overrides?.formConfig,
//   }

//   return {
//     resource: resource,
//     publish: action('save resource'),
//     editResource: async () => action('editing resource submited'),

//     id: 'qjnwglkd69io-sports',
//     url: 'resource.url',
//     downloadFilename: 'resource.pdf',
//     type: 'Web page',
//     fileMaxSize: 5 * 1024 * 1024,

//     isAuthenticated: true,
//     canEdit: false,
//     isCreator: false,
//     isAdmin: false,
//     shouldShowErrors: false,
//     isPublished: false,
//     setIsPublished: action('set is published'),
//     form: useResourceForm(),
//     // tags: TagListStory.slice(0, 1),
//     contentUrl: '#',
//     contentType: 'link',
//     resourceFormat: 'Video',
//     // reportForm: useFormik<{ comment: string }>({
//     //   initialValues: { comment: '' },
//     //   onSubmit: action('submit report Form'),
//     // }),
//     liked: false,
//     numLikes: 23,
//     bookmarked: false,
//     toggleLike: action('toggleLike'),
//     toggleBookmark: action('toggleBookmark'),
//     deleteResource: action('deleteResource'),

//     autoImageAdded: false,
//     canSearchImage: true,
//     ...overrides?.props,
//     ...overrides?.resourceValues,
//   }
// }

// // const headerPageTemplatePropsUnauth: HeaderPageTemplateProps = {
// //   isAuthenticated: false,
// //   headerPageProps: {
// //     headerProps: {
// //       ...HeaderLoggedOutStoryProps,
// //       me: null,
// //     },
// //   },
// //   mainPageWrapperProps: {
// //     userAcceptsPolicies: null,
// //     cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
// //   },
// // }
// // export const LinkLoggedOut = () => {
// //   const props = ResourceStoryProps({
// //     props: {
// //       headerPageTemplateProps: headerPageTemplatePropsUnauth,
// //       isAuthenticated: false,
// //     },
// //   })

// //   return <Resource {...props} />
// // }

// // export const FileLoggedOut = () => {
// //   const props = ResourceStoryProps({
// //     props: {
// //       headerPageTemplateProps: headerPageTemplatePropsUnauth,
// //       isAuthenticated: false,
// //       contentType: 'file',
// //       contentUrl: 'https://picsum.photos/200/100',
// //       resourceFormat: 'Video',
// //     },
// //   })
// //   return <Resource {...props} />
// // }

// export const LoggedIn = () => {
//   const props = useMainResourceCardStoryProps({})
//   return <MainResourceCard {...props} />
// }

// export const Owner = () => {
//   const props = useMainResourceCardStoryProps({
//     props: {
//       isCreator: true,
//       contentType: 'file',
//       contentUrl: 'https://picsum.photos/200/100',
//       resourceFormat: 'Video',
//       // autoImageAdded: true,
//     },
//   })
//   return <MainResourceCard {...props} />
// }

// export const Admin = () => {
//   const props = useMainResourceCardStoryProps({
//     props: {
//       isCreator: true,
//       isAdmin: true,
//     },
//   })
//   return <MainResourceCard {...props} />
// }

// export default meta
