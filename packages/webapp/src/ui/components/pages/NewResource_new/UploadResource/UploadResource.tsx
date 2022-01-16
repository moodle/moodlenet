import { SimplifiedFormik } from '../../../../lib/formik'
export type ContentType = 'File' | 'Link'

export type NewResourceFormValues = Partial<{
  name: string
  contentType: ContentType
  description: string
  category: string
  image: string | File
  content: string | File
  license: string
  published: boolean
}>

type UploadResourceState = 'ChooseResource' | 'EditData'
export type UploadResourceProps = {
  state: UploadResourceState
  form: SimplifiedFormik<NewResourceFormValues>
  categories: [list: SimpleOpt[], selected: SimpleOpt]
  licenses: [list: IconOpt[], selected: IconOpt]
  published: boolean
  nextStep: (() => unknown) | undefined
}

type SimpleOpt = [key: string, label: string]
type IconOpt = [key: string, label: string, iconSrc: string]
