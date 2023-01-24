import { FollowTag, Visibility } from '@moodlenet/component-library'
import { AssetInfo } from '@moodlenet/react-app/common'

export type NewResourceFormValues = {
  // upload
  name: string
  description: string
  category: string
  content: string | File
  visibility: Visibility
  addToCollections: string[]
  license?: string
  // image?: string | File | null
  image?: AssetInfo | null
  type?: string
  level?: string
  month?: string
  year?: string
  language?: string
}

export type ResourceType = {
  id: string
  url: string
  numLikes: number
  tags: FollowTag[]
  contentUrl: string
  resourceFormat: string
  contentType: 'link' | 'file'
  downloadFilename: string
  type: string
}

// isOwner: boolean
//   isAdmin: boolean
//   autoImageAdded: boolean
//   canSearchImage: boolean
//   contributorCardProps: ContributorCardProps
//   form: FormikHandle<Omit<ResourceFormValues, 'addToCollections'>>
//   toggleLikeForm: FormikHandle
//   toggleBookmarkForm: FormikHandle
//   deleteResourceForm?: FormikHandle
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
