import {
  ResourceAccess,
  ResourceActions,
  ResourceFormValues,
  ResourceType,
} from '@moodlenet/resource/common'
import { action } from '@storybook/addon-actions'
import { ComponentMeta } from '@storybook/react'
import { PartialDeep } from 'type-fest'
// import { useEffect } from 'react'
import { addMethod, AnySchema, boolean, mixed, MixedSchema, object, SchemaOf, string } from 'yup'
// import { href } from '../../../elements/link'
// import { TagListStory } from '../../../elements/tags'
// import { HeaderLoggedOutStoryProps } from '../../organisms/Header/Header.stories'
// import { HeaderPageTemplateProps } from '../../templates/HeaderPageTemplate'
// import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
// import { ResourceTextOptionProps } from '../NewResource/AddToResources/storiesData'
import { OptionItemProp } from '@moodlenet/component-library'
import { overrideDeep } from '@moodlenet/component-library/common'

// import {
// import { Resource, ResourceProps } from '@moodlenet/resource/ui'
// import { useFormik } from 'formik'
import { ResourceContributorCardStories } from '@moodlenet/resource/stories'
import { Resource, ResourceProps } from '@moodlenet/resource/ui'
import { useFormik } from 'formik'
import { useEffect } from 'react'
import { MainLayoutLoggedOutStoryProps } from '../../layout/MainLayout/MainLayout.stories.js'

const maxUploadSize = 1024 * 1024 * 50

const meta: ComponentMeta<typeof Resource> = {
  title: 'Pages/Resource',
  component: Resource,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'resourceFormValues',
    'ResourceStoryProps',
    'resourceFormBag',
    'ResourceStoryProps',
    'ResourceLinkLoggedOutStoryProps',
    'ResourceFileLoggedOutStoryProps',
    'ResourceLoggedInStoryProps',
    'ResourceOwnerStoryProps',
    'ResourceAdminStoryProps',
    'validationSchema',
  ],
}

addMethod(MixedSchema, 'oneOfSchemas', function (schemas: AnySchema[]) {
  return this.test(
    'one-of-schemas',
    'Not all items in ${path} match one of the allowed schemas',
    item => schemas.some(schema => schema.isValidSync(item, { strict: true })),
  )
})

export const validationSchema: SchemaOf<ResourceFormValues> = object({
  category: string().required(/* t */ `Please select a subject`),
  content: string().required(/* t */ `Please upload a content`),

  license: string().when('isFile', (isFile, schema) => {
    return isFile ? schema.required(/* t */ `Select a license`) : schema.optional()
  }),
  isFile: boolean().required(),
  description: string().max(4096).min(3).required(/* t */ `Please provide a description`),
  name: string().max(160).min(3).required(/* t */ `Please provide a title`),
  image: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && v.size > maxUploadSize
        ? createError({
            message: /* t */ `The file is too big, reduce the size or provide a url`,
          })
        : true,
    )
    .optional(),
  language: string().optional(),
  level: string().optional(),
  month: string().optional(),
  type: string().optional(),
  visibility: mixed().required(/* t */ `Visibility is required`),
  year: string().when('month', (month, schema) => {
    return month ? schema.required(/* t */ `Please select a year`) : schema.optional()
  }),
})

export const resourceFormValues: ResourceFormValues = {
  content: '',
  // visibility: VisbilityIconTextOptionProps[0]!.value,
  // category: CategoriesTextOptionProps[2]!.value,
  // description:
  //   'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
  description:
    'Earth 2020: An Insider’s Guide to a Rapidly Changing Planet responds to a public increasingly concerned about the deterioration of Earth’s natural systems, offering readers a wealth of perspectives on our shared ecological past, and on the future trajectory of planet Earth. Written by world-leading thinkers on the front-lines of global change research and policy, this multi-disciplinary collection maintains a dual focus: some essays investigate specific facets of the physical Earth system, while others explore the social, legal and political dimensions shaping the human environmental footprint. In doing so, the essays collectively highlight the urgent need for collaboration across diverse domains of expertise in addressing one of the most significant challenges facing us today. Earth 2020 is essential reading for everyone seeking a deeper understanding of the past, present and future of our planet, and the role of humanity in shaping this trajectory.',
  image: 'https://picsum.photos/200/100',
  // language: LanguagesTextOptionProps[2]!.value,
  // level: LevelTextOptionProps[2]!.value,
  // license: LicenseIconTextOptionProps[2]!.value,
  // month: MonthTextOptionProps[8]!.value,
  // year: YearsProps[20],

  name: '',
  // name: 'The Best Resource Ever',
}

export const useResourceForm = (overrides?: Partial<ResourceFormValues>) => {
  return useFormik<ResourceFormValues>({
    validationSchema,
    onSubmit: action('submit edit'),
    initialValues: {
      content: '',
      name: 'Best resource ever',
      description:
        'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
      image:
        'https://images.unsplash.com/photo-1543964198-d54e4f0e44e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    },
    ...overrides,
  })
}

export const CollectionTextOptionProps: OptionItemProp[] = [
  { label: 'Education', value: 'Education' },
  { label: 'Biology', value: 'Biology' },
  { label: 'Algebra', value: 'Algebra' },
  { label: 'Phycology', value: 'Phycology' },
  { label: 'Phylosophy', value: 'Phylosophy' },
  { label: 'Sociology', value: 'Sociology' },
  { label: 'English Literature', value: 'English Literature' },
]

export const useResourceStoryProps = (
  overrides?: PartialDeep<ResourceProps>,
  //   {
  //   props?: Partial<ResourceProps>
  //   resource?: Partial<ResourceType>
  //   resourceForm?: Partial<ResourceFormValues>
  //   actions?: Partial<ResourceActions>
  //   access?: Partial<ResourceAccess>
  //   mainResourceCardSlots?: Partial<MainResourceCardSlots>
  // }
): ResourceProps => {
  const resourceForm: ResourceFormValues = {
    // validationSchema,
    // onSubmit: action('submit edit'),
    // initialValues: {
    content: 'random-link.com',
    // content: null,
    name: 'Best resource ever',
    description:
      'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us. This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us. This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
    image:
      'https://images.unsplash.com/photo-1543964198-d54e4f0e44e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    // ...overrides?.resourceForm,
  }

  const addToCollectionsForm = useFormik<{ collections: string[] }>({
    initialValues: { collections: [] },
    // onSubmit() {},
    async onSubmit() {
      return
    },
    validate({ collections: curr }) {
      const prev = addToCollectionsForm.values.collections
      const toAdd = curr.filter(_ => !prev.includes(_))[0]
      const toRemove = prev.filter(_ => !curr.includes(_))[0]
      toAdd && action('Add ')(toAdd)
      toRemove && action('Remove ')(toRemove)
    },
  })

  useEffect(
    () =>
      action('changed addToCollectionsForm.values')(
        addToCollectionsForm.values.collections.join(';'),
      ),
    [addToCollectionsForm.values.collections],
  )

  const resource: ResourceType = {
    id: 'qjnwglkd69io-sports',
    mnUrl: 'resource.url',
    downloadFilename: 'resource.pdf',
    specificContentType: 'pdf',
    contentType: 'file',
    contentUrl: '#',
    isPublished: true,
    numLikes: 23,
    // ...overrides?.resource,
  }

  const actions: ResourceActions = {
    liked: false,
    bookmarked: false,
    toggleLike: action('toggleLike'),
    toggleBookmark: action('toggleBookmark'),
    deleteResource: action('deleteResource'),
    editResource: async () => action('editing resource submited'),
    setIsPublished: action('setIsPublished'),
    ...overrides?.actions,
  }

  const access: ResourceAccess = {
    isAuthenticated: true,
    canEdit: false,
    isOwner: false,
    isAdmin: false,
    // ...overrides?.access,
  }

  const mainResourceCardSlots = {
    mainColumnItems: [],
    headerColumnItems: [],
    topLeftHeaderItems: [],
    topRightHeaderItems: [],
    moreButtonItems: [],
    footerRowItems: [],
  }

  return overrideDeep<ResourceProps>(
    // mainLayoutProps:
    //   overrides?.props?.access?.isAuthenticated !== undefined && !overrides?.props?.access?.isAuthenticated
    //     ? MainLayoutLoggedOutStoryProps
    //     : MainLayoutLoggedInStoryProps,

    {
      mainLayoutProps: MainLayoutLoggedOutStoryProps,
      fileMaxSize: 343243,
      mainResourceCardSlots: mainResourceCardSlots,
      resourceContributorCardProps:
        ResourceContributorCardStories.ResourceContributorCardStoryProps,

      resource: resource,
      resourceForm: resourceForm,
      actions: actions,
      access: access,
      validationSchema: validationSchema,
    },
    { ...overrides },
  )
}

export default meta
