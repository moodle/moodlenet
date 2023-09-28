import type { AssetInfo } from '@moodlenet/component-library/common'
import { overrideDeep } from '@moodlenet/component-library/common'
import type {
  EdMetaOptionsProps,
  ResourceAccessProps,
  ResourceActions,
  ResourceDataProps,
  ResourceFormProps,
  ResourceStateProps,
  SaveState,
} from '@moodlenet/ed-resource/common'
import { getValidationSchemas } from '@moodlenet/ed-resource/common'
import { action } from '@storybook/addon-actions'
import type { Meta as ComponentMeta } from '@storybook/react'
import type { PartialDeep } from 'type-fest'
// import { useEffect } from 'react'
import type { AnySchema } from 'yup'
import { addMethod, MixedSchema } from 'yup'
// import { href } from '../../../elements/link'
// import { TagListStory } from '../../../elements/tags'
// import { HeaderLoggedOutStoryProps } from '../../organisms/Header/Header.stories'
// import { HeaderPageTemplateProps } from '../../templates/HeaderPageTemplate'
// import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
// import { ResourceTextOptionProps } from '../NewResource/AddToResources/storiesData'
import type { AddonItem } from '@moodlenet/component-library'

// import {
// import { Resource, ResourceProps } from '@moodlenet/ed-resource/ui'
// import { useFormik } from 'formik'
import { AddToCollectionButtonStories } from '@moodlenet/collection/stories'
import { FieldsDataStories } from '@moodlenet/ed-meta/stories'
import { ResourceContributorCardStories } from '@moodlenet/ed-resource/stories'
import type { MainResourceCardSlots, ResourceProps } from '@moodlenet/ed-resource/ui'
import { Resource } from '@moodlenet/ed-resource/ui'
import { href } from '@moodlenet/react-app/common'

import type { BookmarkButtonProps, LikeButtonProps } from '@moodlenet/web-user/ui'
import { BookmarkButton, LikeButton } from '@moodlenet/web-user/ui'
import { useFormik } from 'formik'
import { useState } from 'react'
import {
  MainLayoutLoggedInStoryProps,
  MainLayoutLoggedOutStoryProps,
} from '../../layout/MainLayout/MainLayout.stories.js'

import type { LearningOutcome } from '@moodlenet/ed-meta/common'
import { SendToMoodle } from '@moodlenet/moodle-lms-integration/webapp/ui'
import { learningOutcomeOptions, learningOutcomesSelection } from './ResourceData.stories.props.js'

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
    'useResourceForm',
    'useResourceStoryProps',
    'CollectionTextOptionProps',
    'ResourceFormValues',
  ],
}

addMethod(MixedSchema, 'oneOfSchemas', function (schemas: AnySchema[]) {
  return this.test(
    'one-of-schemas',
    'Not all items in ${path} match one of the allowed schemas',
    item => schemas.some(schema => schema.isValidSync(item, { strict: true })),
  )
})

export const ResourceFormValues: ResourceFormProps = {
  title: '',
  description:
    'Earth 2020: An Insider’s Guide to a Rapidly Changing Planet responds to a public increasingly concerned about the deterioration of Earth’s natural systems, offering readers a wealth of perspectives on our shared ecological past, and on the future trajectory of planet Earth. Written by world-leading thinkers on the front-lines of global change research and policy, this multi-disciplinary collection maintains a dual focus: some essays investigate specific facets of the physical Earth system, while others explore the social, legal and political dimensions shaping the human environmental footprint. In doing so, the essays collectively highlight the urgent need for collaboration across diverse domains of expertise in addressing one of the most significant challenges facing us today. Earth 2020 is essential reading for everyone seeking a deeper understanding of the past, present and future of our planet, and the role of humanity in shaping this trajectory.',
  subject: FieldsDataStories.SubjectsTextOptionProps[2]?.value ?? '',
  language: FieldsDataStories.LanguagesTextOptionProps[2]?.value ?? '',
  level: FieldsDataStories.LevelTextOptionProps[2]?.value ?? '',
  license: FieldsDataStories.LicenseIconTextOptionProps[2]?.value ?? '',
  month: FieldsDataStories.MonthTextOptionProps[8]?.value ?? '',
  year: FieldsDataStories.YearsProps[20]?.valueOf() ?? '',
  type: FieldsDataStories.TypeTextOptionProps[1]?.value ?? '',
  learningOutcomes: learningOutcomesSelection,
}

export const useResourceForm = (overrides?: Partial<ResourceFormProps>) => {
  return useFormik<ResourceFormProps>({
    validationSchema: getValidationSchemas({
      contentMaxUploadSize: 1000000000,
      imageMaxUploadSize: 1000000000,
    }).publishedResourceValidationSchema,
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
      learningOutcomes: [],
    },
    ...overrides,
  })
}

// export const CollectionTextOptionProps: OptionItemProp[] = [
//   { label: 'Education', value: 'Education' },
//   { label: 'Biology', value: 'Biology' },
//   { label: 'Algebra', value: 'Algebra' },
//   { label: 'Phycology', value: 'Phycology' },
//   { label: 'Phylosophy', value: 'Phylosophy' },
//   { label: 'Sociology', value: 'Sociology' },
//   { label: 'English Literature', value: 'English Literature' },
// ]

export const useResourceStoryProps = (
  overrides?: PartialDeep<
    ResourceProps & {
      isAuthenticated: boolean
      bookmarkButtonProps: BookmarkButtonProps
      likeButtonProps: LikeButtonProps
    }
  >,
  //   {
  //   props?: Partial<ResourceProps>
  //   resource?: Partial<ResourceType>
  //   resourceForm?: Partial<ResourceFormProps>
  //   actions?: Partial<ResourceActions>
  //   access?: Partial<ResourceAccess>
  //   mainResourceCardSlots?: Partial<MainResourceCardSlots>
  // }
): ResourceProps => {
  const [contentUrl, setContentUrl] = useState<string | null>(overrides?.data?.contentUrl ?? null)
  const [image, setImageData] = useState<AssetInfo | null>(
    overrides?.data?.image?.location || overrides?.data?.image?.location === undefined
      ? {
          credits: {
            owner: {
              name: overrides?.data?.image?.credits?.owner?.name ?? 'Ivan Bandura',
              url:
                overrides?.data?.image?.credits?.owner?.url ??
                'https://unsplash.com/@unstable_affliction',
            },
            provider: {
              name: overrides?.data?.image?.credits?.owner?.name ?? 'Unsplash',
              url: overrides?.data?.image?.credits?.owner?.url ?? 'https://unsplash.com',
            },
          },
          location:
            overrides?.data?.image?.location ??
            'https://images.unsplash.com/photo-1593259996642-a62989601967?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
        }
      : null,
  )
  const [filename, setFilename] = useState<string | null>(overrides?.data?.downloadFilename ?? null)
  const [contentType, setContentType] = useState<'link' | 'file' | null>(
    overrides?.data?.contentType ?? null,
  )

  // setInterval(() => setIsSaving(!isSaving), 1000)

  const isAuthenticated = overrides?.isAuthenticated ?? true

  //const transforming overrides.resourceForm.learningOutcomes to an array of LearningOutcome

  const updatedLearningOutcomes =
    overrides && overrides.resourceForm && overrides.resourceForm.learningOutcomes
      ? overrides.resourceForm.learningOutcomes
          .filter(outcome => outcome !== undefined)
          .map(outcome => outcome as LearningOutcome)
      : learningOutcomesSelection

  const resourceForm: ResourceFormProps = {
    title: 'Protecting and restoring endangered ecosystems',
    description:
      'This educational resource provides valuable insights into the critical importance of ecosystem preservation and how to take practical steps towards their revitalization. This educational resource provides valuable insights into the critical importance of ecosystem preservation and how to take practical steps towards their revitalization. This educational resource provides valuable insights into the critical importance of ecosystem preservation and how to take practical steps towards their revitalization. This educational resource provides valuable insights into the critical importance of ecosystem preservation and how to take practical steps towards their revitalization.',
    subject: '0522',
    license: 'CC-0 (Public domain)',
    type: '2',
    language: 'English',
    level: '6',
    month: '5',
    year: '2022',
    ...overrides?.resourceForm,
    learningOutcomes: updatedLearningOutcomes,
  }

  const [formData, setFormData] = useState(resourceForm)

  const data: ResourceDataProps = {
    id: 'qjnwglkd69io-sports',
    mnUrl: 'resource.url',
    contentUrl: contentUrl,
    downloadFilename: filename,
    contentType: contentType,
    ...overrides?.data,
    subjectHref: href('Pages/subject/Logged In'),
    image,
  }

  const [isSavingContent, setIsSavingContent] = useState(
    overrides?.saveState?.content ?? 'not-saving',
  )
  const [isSavingImage, setIsSavingImage] = useState(overrides?.saveState?.image ?? 'not-saving')

  const saveContent = () => {
    setIsSavingContent('saving')
    setTimeout(() => {
      setIsSavingContent('save-done')
      setTimeout(() => {
        setIsSavingContent('not-saving')
      }, 100)
    }, 4000)
  }

  const saveImage = () => {
    setIsSavingImage('saving')
    setTimeout(() => {
      setIsSavingImage('save-done')
      setTimeout(() => {
        setIsSavingImage('not-saving')
      }, 100)
    }, 1000)
  }

  const setContent = (e: File | string | undefined | null) => {
    setTimeout(() => {
      if (typeof e === 'string') {
        setContentUrl('https://learngermanwithanja.com/the-german-accusative-case/#t-1632135010328')
        setFilename(null)
        setContentType('link')
      } else if (e) {
        setContentUrl(
          'https://moodle.net/.pkg/@moodlenet/ed-resource/dl/ed-resource/1Vj2B7Mj/557_Sujeto_y_Predicado.pdf',
        )
        setContentType('file')
        setFilename(e.name)
      } else {
        setContentUrl(null)
        setContentType(null)
        setFilename(null)
      }
    }, 1000)
    saveContent()

    action('set content')(e)
  }

  const setImage = (e: File | string | undefined | null) => {
    setTimeout(() => {
      if (typeof e === 'string') {
        setImageData({ location: e, credits: null })
      } else if (e) {
        setImageData({ location: URL.createObjectURL(e), credits: null })
      } else {
        setImageData(null)
      }
    }, 1000)
    saveImage()

    action('set image')(e)
  }

  const [isPublished, setIsPublished] = useState(
    overrides?.state?.isPublished !== undefined ? overrides?.state?.isPublished : true,
  )

  const actions: ResourceActions = {
    deleteResource: action('delete resource'),
    editData: setFormData,
    publish: () => {
      setIsPublished(true)
    },
    unpublish: () => {
      setIsPublished(false)
    },
    setContent: setContent,
    setImage: setImage,
    ...overrides?.actions,
  }

  const state: ResourceStateProps = {
    isPublished: isPublished,
    ...overrides?.state,
  }

  const access: ResourceAccessProps = {
    canEdit: false,
    isCreator: false,
    canDelete: false,
    canPublish: false,
    ...overrides?.access,
  }

  const edMetaOptions: EdMetaOptionsProps = {
    subjectOptions: FieldsDataStories.SubjectsTextOptionProps,
    languageOptions: FieldsDataStories.LanguagesTextOptionProps,
    levelOptions: FieldsDataStories.LevelTextOptionProps,
    licenseOptions: FieldsDataStories.LicenseIconTextOptionProps,
    monthOptions: FieldsDataStories.MonthTextOptionProps,
    yearOptions: FieldsDataStories.YearsProps,
    typeOptions: FieldsDataStories.TypeTextOptionProps,
    learningOutcomeOptions: learningOutcomeOptions,
  }

  const likeButtonProps: LikeButtonProps = {
    liked: true,
    canLike: true,
    numLikes: 10,
    toggleLike: action('toggleLike'),
    isCreator: false,
    ...overrides?.bookmarkButtonProps,
    isAuthenticated,
  }

  const bookmarkButtonProps: BookmarkButtonProps = {
    bookmarked: true,
    canBookmark: true,
    toggleBookmark: action('toggleBookmark'),
    ...overrides?.bookmarkButtonProps,
    isAuthenticated,
  }

  const mainResourceCardSlots: MainResourceCardSlots = {
    mainColumnItems: [],
    headerColumnItems: [],
    topLeftHeaderItems: [],
    topRightHeaderItems: [
      isPublished
        ? {
            Item: () => <LikeButton {...likeButtonProps} />,

            key: 'like-button',
          }
        : null,
      isPublished
        ? {
            Item: () => <BookmarkButton {...bookmarkButtonProps} />,
            key: 'bookmark-button',
          }
        : null,
    ],
    moreButtonItems: [],
    footerRowItems: [],
    uploadOptionsItems: [
      // {
      //   Item: () => <Unsplash />,
      //   key: 'unsplash-open-button',
      // },
    ],
  }

  const extraDetailsItems: AddonItem[] = []

  const sendToMoodle = {
    Item: () => (
      <SendToMoodle
        site="https://moodle.technion.ac.il"
        userId="1234"
        sendToMoodle={() => undefined}
        canSendToMoodle={true}
      />
    ),
    key: 'send-to-moodle',
  }

  const generalActionsItems: AddonItem[] = [
    sendToMoodle,
    AddToCollectionButtonStories.useAddToCollectionButtonStory(),
  ]

  const saveState: SaveState = {
    form: overrides?.saveState?.form ?? 'not-saving',
    content: isSavingContent,
    image: isSavingImage,
  }

  return overrideDeep<ResourceProps>(
    {
      mainLayoutProps: isAuthenticated
        ? MainLayoutLoggedInStoryProps
        : MainLayoutLoggedOutStoryProps,

      wideColumnItems: [],
      mainColumnItems: [],
      rightColumnItems: [],
      generalActionsItems: generalActionsItems,
      mainResourceCardSlots: mainResourceCardSlots,
      resourceContributorCardProps:
        ResourceContributorCardStories.ResourceContributorCardStoryProps,

      data: data,
      resourceForm: formData,
      state: state,
      actions: actions,
      access: access,
      edMetaOptions: edMetaOptions,

      validationSchemas: getValidationSchemas({
        contentMaxUploadSize: 1024 * 1024 * 1024,
        imageMaxUploadSize: 1024 * 1024 * 25,
      }),

      extraDetailsItems: extraDetailsItems,

      fileMaxSize: 343243,
      saveState: saveState,
    },
    overrides,
  )
}

export default meta
