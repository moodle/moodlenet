import { action } from '@storybook/addon-actions'
import { ComponentMeta } from '@storybook/react'
import { FormikConfig, useFormik } from 'formik'
import { href } from '../../../elements/link'
import { TagListStory } from '../../../elements/tags'
import { HeaderLoggedOutStoryProps } from '../../organisms/Header/Header.stories'
import { HeaderPageTemplateProps } from '../../templates/HeaderPageTemplate'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { CollectionTextOptionProps } from '../NewResource/AddToCollections/storiesData'
import {
  LanguagesTextOptionProps,
  LevelTextOptionProps,
  MonthTextOptionProps,
  TypeTextOptionProps,
  YearsProps,
} from '../NewResource/ExtraDetails/storiesData'
import { NewResourceFormValues } from '../NewResource/types'
import {
  CategoriesTextOptionProps,
  LicenseIconTextOptionProps,
} from '../NewResource/UploadResource/storiesData'
import { ContributorCardStoryProps } from './ContributorCard/ContributorCard.stories'
import { Resource, ResourceProps } from './Resource'

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
  ],
}

export const resourceFormValues: NewResourceFormValues = {
  visibility: 'private',
  category: CategoriesTextOptionProps[2]!.value,
  content: '',
  description:
    'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
  image: 'https://picsum.photos/200/100',
  language: LanguagesTextOptionProps[2]!.value,
  level: LevelTextOptionProps[2]!.value,
  license: LicenseIconTextOptionProps[2]!.value,
  month: MonthTextOptionProps[8]!.value,
  year: YearsProps[20],
  name: 'The Best Resource Ever',
  type: TypeTextOptionProps[2]!.value,
}

export const ResourceStoryProps = ({
  formikOverrides,
  propsOverrides,
}: {
  propsOverrides?: Partial<ResourceProps>
  formikOverrides?: Partial<FormikConfig<NewResourceFormValues>>
}): ResourceProps => {
  const form = useFormik<NewResourceFormValues>({
    onSubmit: action('submit edit'),
    initialValues: resourceFormValues,
    ...formikOverrides,
  })
  return {
    form,
    headerPageTemplateProps: {
      headerPageProps: HeaderPageLoggedInStoryProps,
      isAuthenticated: true,
      mainPageWrapperProps: {
        userAcceptsPolicies: null,
        cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
      },
    },
    isAuthenticated: true,
    isOwner: false,
    isAdmin: false,
    liked: false,
    numLikes: 23,
    bookmarked: true,
    tags: TagListStory,
    contributorCardProps: ContributorCardStoryProps,
    contentUrl: '#',
    contentType: 'link',
    resourceFormat: 'Video',
    collections: {
      opts: CollectionTextOptionProps,
      selected: CollectionTextOptionProps.filter(
        ({ value }) => !!form.values.addToCollections?.includes(value)
      ),
    },
    types: {
      opts: TypeTextOptionProps,
      selected: TypeTextOptionProps.find(
        ({ value }) => value === form.values.type
      ),
    },
    levels: {
      opts: LevelTextOptionProps,
      selected: LevelTextOptionProps.find(
        ({ value }) => value === form.values.level
      ),
    },
    languages: {
      opts: LanguagesTextOptionProps,
      selected: LanguagesTextOptionProps.find(
        ({ value }) => value === form.values.language
      ),
    },
    categories: {
      opts: CategoriesTextOptionProps,
      selected: CategoriesTextOptionProps.find(
        ({ value }) => value === form.values.category
      ),
    },
    licenses: {
      opts: LicenseIconTextOptionProps,
      selected: LicenseIconTextOptionProps.find(
        ({ value }) => value === form.values.license
      ),
    },
    toggleLike: useFormik({
      initialValues: {},
      onSubmit: action('toggleLike'),
    }),
    toggleBookmark: useFormik({
      initialValues: {},
      onSubmit: action('toggleBookmark'),
    }),
    deleteResource: useFormik({
      initialValues: {},
      onSubmit: action('Delete Resource'),
    }),
    sendToMoodleLms: useFormik<{ site?: string }>({
      initialValues: { site: 'http://my-lms.org' },
      onSubmit: action('Send to Moodle LMS'),
    }),
    ...propsOverrides,
  }
}

const headerPageTemplatePropsUnauth: HeaderPageTemplateProps = {
  isAuthenticated: false,
  headerPageProps: {
    headerProps: {
      ...HeaderLoggedOutStoryProps,
      me: null,
    },
  },
  mainPageWrapperProps: {
    userAcceptsPolicies: null,
    cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
  },
}
export const LinkLoggedOut = () => {
  const props = ResourceStoryProps({
    propsOverrides: {
      headerPageTemplateProps: headerPageTemplatePropsUnauth,
      isAuthenticated: false,
    },
  })

  return <Resource {...props} />
}

export const FileLoggedOut = () => {
  const props = ResourceStoryProps({
    propsOverrides: {
      headerPageTemplateProps: headerPageTemplatePropsUnauth,
      isAuthenticated: false,
      contentType: 'file',
      contentUrl: 'https://picsum.photos/200/100',
      resourceFormat: 'Video',
    },
  })
  return <Resource {...props} />
}

export const LoggedIn = () => {
  const props = ResourceStoryProps({})
  return <Resource {...props} />
}

export const Owner = () => {
  const props = ResourceStoryProps({
    propsOverrides: {
      isOwner: true,
    },
  })
  return <Resource {...props} />
}

export const Admin = () => {
  const props = ResourceStoryProps({
    propsOverrides: {
      isOwner: true,
      isAdmin: true,
    },
  })
  return <Resource {...props} />
}

export default meta
