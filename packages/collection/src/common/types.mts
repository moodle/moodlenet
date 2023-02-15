import { FollowTag } from '@moodlenet/component-library'
import { AssetInfo } from '@moodlenet/react-app/common'

export type CollectionFormValues = {
  // upload
  name: string
  description: string
  content: string | File | null
  // category: string
  // visibility: Visibility
  // addToCollections: string[]
  // license?: string
  // image?: string | File | null
  image?: AssetInfo | null
  type?: string
  // level?: string
  // month?: string
  // year?: string
  // language?: string
  isFile: boolean
}

export type CollectionType = {
  id: string
  url: string
  numFollowers: number
  collectionUrl: string
}

// isOwner: boolean
//   isAdmin: boolean
//   autoImageAdded: boolean
//   canSearchImage: boolean
//   contributorCardProps: ContributorCardProps
//   form: FormikHandle<Omit<CollectionFormValues, 'addToCollections'>>
//   toggleLikeForm: FormikHandle
//   toggleBookmarkForm: FormikHandle
//   deleteCollectionForm?: FormikHandle
//   addToCollectionsForm: FormikHandle<{ collections: string[] }>
//   sendToMoodleLmsForm: FormikHandle<{ site?: string }>
//   collections: SelectOptionsMulti<OptionItemProp>
// reportForm?: FormikHandle<{ comment: string }>
// licenses: SelectOptions<IconTextOptionProps>
// setCategoryFilter(text: string): unknown
// categories: SelectOptions<TextOptionProps>
// setTypeFilter(text: string): unknown
// types: SelectOptions<TextOptionProps>
// setLevelFilter(text: string): unknown
// levels: SelectOptions<TextOptionProps>
// setLanguageFilter(text: string): unknown
// languages: SelectOptions<TextOptionProps>

export type Organization = {
  name: string
  shortName: string
  title: string
  subtitle: string
  url: string
  logo: string
  smallLogo: string
  // description: string
  color: string
}

export const getCollectionTypeInfo = (type: string): { typeName: string; typeColor: string } => {
  switch (type) {
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'mkv':
    case 'webm':
    case 'avchd':
    case 'flv':
    case 'f4v':
    case 'swf':
      return { typeName: `Video`, typeColor: '#2A75C0' }
    case 'mp3':
    case 'wav':
    case 'wma':
    case 'aac':
    case 'm4a':
      return { typeName: `Audio`, typeColor: '#8033c7' }
    case 'jpeg':
    case 'jpg':
    case 'png':
    case 'gif':
      return { typeName: `Image`, typeColor: '#27a930' }
    case 'pdf':
      return { typeName: 'pdf', typeColor: '#df3131' }
    case 'xls':
    case 'xlsx':
    case 'ods':
      return { typeName: `Spreadshee`, typeColor: '#0f9d58' }
    case 'doc':
    case 'docx':
    case 'odt':
      return { typeName: 'Word', typeColor: '#4285f4' }
    case 'ppt':
    case 'pptx':
    case 'odp':
      return { typeName: `Presentation`, typeColor: '#dfa600' }
    case 'mbz':
      return { typeName: 'Moodle course', typeColor: '#f88012' }
    case 'Web Page':
      return { typeName: `Web page`, typeColor: '#C233C7' }
    default:
      return { typeName: type, typeColor: '#15845A' }
  }
}

export type CollectionInfo = {
  type: CollectionType
  title: string
  tags: Pick<FollowTag, 'name'>[]
  image: string
}
