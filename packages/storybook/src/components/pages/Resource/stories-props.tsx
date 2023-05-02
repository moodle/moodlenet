import { overrideDeep } from '@moodlenet/component-library/common'
import {
  ResourceAccessProps,
  ResourceActions,
  ResourceDataProps,
  ResourceFormProps,
  ResourceStateProps,
} from '@moodlenet/ed-resource/common'
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
import { AddonItem, OptionItemProp } from '@moodlenet/component-library'

// import {
// import { Resource, ResourceProps } from '@moodlenet/ed-resource/ui'
// import { useFormik } from 'formik'
import { AddToCollectionButtonStories } from '@moodlenet/collection/stories'
import { ResourceContributorCardStories } from '@moodlenet/ed-resource/stories'
import { MainResourceCardSlots, Resource, ResourceProps } from '@moodlenet/ed-resource/ui'
import { BookmarkButton, LikeButton } from '@moodlenet/web-user/ui'
import { useFormik } from 'formik'
import { useState } from 'react'
import {
  MainLayoutLoggedInStoryProps,
  MainLayoutLoggedOutStoryProps,
} from '../../layout/MainLayout/MainLayout.stories.js'

const maxUploadSize = 1024 * 1024 * 50

const meta: ComponentMeta<typeof Resource> = {
  title: 'Pages/Resource',
  component: Resource,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'ResourceFormProps',
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

export const validationSchema: SchemaOf<ResourceFormProps> = object({
  subject: string().required(/* t */ `Please select a subject`),
  content: string().required(/* t */ `Please upload a content`),
  license: string().required(/* t */ `Please provide a license`),
  isFile: boolean().required(),
  description: string().max(4096).min(3).required(/* t */ `Please provide a description`),
  title: string().max(160).min(3).required(/* t */ `Please provide a title`),
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

export const contentValidationSchema: SchemaOf<{ content: File | string | undefined | null }> =
  object({
    content: string().required(`Please upload a content or a link`),
  })

export const ResourceFormValues: ResourceFormProps = {
  description:
    'Earth 2020: An Insider’s Guide to a Rapidly Changing Planet responds to a public increasingly concerned about the deterioration of Earth’s natural systems, offering readers a wealth of perspectives on our shared ecological past, and on the future trajectory of planet Earth. Written by world-leading thinkers on the front-lines of global change research and policy, this multi-disciplinary collection maintains a dual focus: some essays investigate specific facets of the physical Earth system, while others explore the social, legal and political dimensions shaping the human environmental footprint. In doing so, the essays collectively highlight the urgent need for collaboration across diverse domains of expertise in addressing one of the most significant challenges facing us today. Earth 2020 is essential reading for everyone seeking a deeper understanding of the past, present and future of our planet, and the role of humanity in shaping this trajectory.',
  title: '',
  // content: '',
  // visibility: VisbilityIconTextOptionProps[0]!.value,
  // category: CategoriesTextOptionProps[2]!.value,
  // description:
  //   'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
  // image: 'https://picsum.photos/200/100',
  // language: LanguagesTextOptionProps[2]!.value,
  // level: LevelTextOptionProps[2]!.value,
  // license: LicenseIconTextOptionProps[2]!.value,
  // month: MonthTextOptionProps[8]!.value,
  // year: YearsProps[20],

  // name: 'The Best Resource Ever',
}

export const useResourceForm = (overrides?: Partial<ResourceFormProps>) => {
  return useFormik<ResourceFormProps>({
    validationSchema,
    onSubmit: action('submit edit'),
    initialValues: {
      title: 'Best resource ever',
      description:
        'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
      subject: '',
      license: '',
      type: '',
      language: '',
      level: '',
      month: '',
      year: '',
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
  overrides?: PartialDeep<ResourceProps & { isAuthenticated: boolean }>,
  //   {
  //   props?: Partial<ResourceProps>
  //   resource?: Partial<ResourceType>
  //   resourceForm?: Partial<ResourceFormProps>
  //   actions?: Partial<ResourceActions>
  //   access?: Partial<ResourceAccess>
  //   mainResourceCardSlots?: Partial<MainResourceCardSlots>
  // }
): ResourceProps => {
  const [filename, setFilename] = useState<string | null>('filename.pdf')

  const isAuthenticated = overrides?.isAuthenticated ?? true

  const resourceForm: ResourceFormProps = {
    title: 'Best resource ever',
    description:
      'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us. This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us. This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
    subject: '0011',
    license: 'CC-0 (Public domain)',
    type: undefined, //'Course',
    language: undefined,
    level: undefined,
    month: undefined,
    year: undefined,
    ...overrides?.resourceForm,
  }

  const data: ResourceDataProps = {
    resourceId: 'qjnwglkd69io-sports',
    mnUrl: 'resource.url',
    contentUrl: 'https://www.africau.edu/images/default/sample.pdf',
    // contentUrl: 'https://moodle.net/profile/d488bc9d51ef-moodle-academy',
    // contentUrl: 'https://youtu.be/dZNC5kIvM00',
    // contentUrl: 'https://vimeo.com/204467192',
    imageUrl:
      'https://images.unsplash.com/photo-1543964198-d54e4f0e44e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    downloadFilename: filename,
    contentType: 'file',
    // contentType: 'link',
    ...overrides?.data,
  }

  const state: ResourceStateProps = {
    isPublished: true,
    liked: true,
    numLikes: 23,
    bookmarked: false,
    ...overrides?.state,
  }

  const setContent = (e: File | string | undefined | null) => {
    console.log('set content')
    typeof e === 'string' ? setFilename(null) : e ? setFilename(e.name) : null
    action('set content')(e)
  }

  const actions: ResourceActions = {
    deleteResource: action('delete resource'),
    editData: action('editing resource submited'),
    publish: action('publish'),
    unpublish: action('unpublish'),
    setContent: setContent,
    setImage: action('set image'),
    toggleLike: action('toggleLike'),
    toggleBookmark: action('toggleBookmark'),
    ...overrides?.actions,
  }

  const access: ResourceAccessProps = {
    canEdit: false,
    isCreator: false,
    canDelete: false,
    canPublish: false,
    canLike: true,
    canBookmark: true,
    isAuthenticated: true,
    ...overrides?.access,
  }

  const isPublished =
    overrides?.state?.isPublished !== undefined ? overrides?.state?.isPublished : true

  const mainResourceCardSlots: MainResourceCardSlots = {
    mainColumnItems: [],
    headerColumnItems: [],
    topLeftHeaderItems: [],
    topRightHeaderItems: [
      isPublished
        ? {
            Item: () => (
              <LikeButton
                canLike={access.canLike}
                liked={state.liked}
                isAuthenticated={access.isAuthenticated}
                isCreator={access.isCreator}
                toggleLike={actions.toggleLike}
                numLikes={state.numLikes}
              />
            ),

            key: 'like-button',
          }
        : null,
      isPublished
        ? {
            Item: () => (
              <BookmarkButton
                canBookmark={access.canBookmark}
                bookmarked={state.bookmarked}
                isAuthenticated={access.isAuthenticated}
                toggleBookmark={actions.toggleBookmark}
              />
            ),
            key: 'bookmark-button',
          }
        : null,
    ],
    moreButtonItems: [],
    footerRowItems: [],
  }

  const extraDetailsItems: AddonItem[] = []
  const generalActionsItems: AddonItem[] = [
    AddToCollectionButtonStories.useAddToCollectionButtonStory(),
  ]

  return overrideDeep<ResourceProps>(
    {
      mainLayoutProps: isAuthenticated
        ? MainLayoutLoggedInStoryProps
        : MainLayoutLoggedOutStoryProps,

      mainColumnItems: [],
      sideColumnItems: [],
      generalActionsItems: generalActionsItems,
      mainResourceCardSlots: mainResourceCardSlots,
      resourceContributorCardProps:
        ResourceContributorCardStories.ResourceContributorCardStoryProps,

      data: data,
      resourceForm: resourceForm,
      state: state,
      actions: actions,
      access: access,

      validationSchema: validationSchema,
      contentValidationSchema: contentValidationSchema,
      extraDetailsItems: extraDetailsItems,

      fileMaxSize: 343243,
      isSaving: false,
    },
    overrides,
  )
}

export default meta
