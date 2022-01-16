import { CP } from '../../../lib/ctrl'
import { HeaderPageTemplateProps } from '../../templates/HeaderPageTemplate'
import { AddToCollectionsProps } from './AddToCollections/AddToCollections'
import { ExtraDetailsProps } from './ExtraDetails/ExtraDetails'
import './styles.scss'
import { UploadResourceProps } from './UploadResource/UploadResource'

export type NewResourceProps = {
  stepProps: UploadResourceProps | AddToCollectionsProps | ExtraDetailsProps
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
}
