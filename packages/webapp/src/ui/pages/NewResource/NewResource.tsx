import { t } from '@lingui/macro'
import { assertNever } from '@moodlenet/common/lib/utils/misc'
import ProgressState from '../../components/atoms/ProgressState/ProgressState'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import { AddToCollections, AddToCollectionsProps } from './AddToCollections/AddToCollections'
import { ExtraDetails, ExtraDetailsProps } from './ExtraDetails/ExtraDetails'
import './styles.scss'
import { UploadResource, UploadResourceProps } from './UploadResource/UploadResource'

export type NewResourceState = 'UploadResource' | 'AddToCollections' | 'ExtraDetails'
export type NewResourceProgressState = [NewResourceState, string][]

export type NewResourceProps = {
  stepProps: UploadResourceProps | AddToCollectionsProps | ExtraDetailsProps
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  // uploadResource: UploadResourceProps
  // states: NewResourceProgressState
  // currentState: NewResourceState
}

const progressStates = [t`Upload resource`, t`Add to collections`, t`Add details`]
const progressSubtitles = [``, t`Earn 1 Point `, t`Earn 5 Points by completing this useful information`]
export const NewResource = withCtrl<NewResourceProps>(({ stepProps, headerPageTemplateProps }) => {
  const progressCurrentIndex =
    stepProps.step === 'UploadResourceStep'
      ? 0
      : stepProps.step === 'AddToCollectionsStep'
      ? 1
      : stepProps.step === 'ExtraDetailsStep'
      ? 2
      : assertNever(stepProps, `unknown stepProps: step=${(stepProps as any)?.step}`)

  // if (progressCurrentIndex === undefined) {
  //   console.error({ stepProps })
  //   throw new Error(`unknown stepProps: step=${stepProps.step}`)
  // }

  return (
    <HeaderPageTemplate {...headerPageTemplateProps} style={{ backgroundColor: '#f4f5f7' }}>
      <div className="new-resource">
        <ProgressState
          stateNames={progressStates}
          currentIndex={progressCurrentIndex}
          progressSubtitles={progressSubtitles}
        />
        <div className="content">
          {stepProps.step === 'UploadResourceStep' ? (
            <UploadResource {...stepProps} />
          ) : stepProps.step === 'AddToCollectionsStep' ? (
            <AddToCollections {...stepProps} />
          ) : stepProps.step === 'ExtraDetailsStep' ? (
            <ExtraDetails {...stepProps} />
          ) : (
            assertNever(stepProps, `Should never happen`)
          )}
        </div>
      </div>
    </HeaderPageTemplate>
  )
})
NewResource.displayName = 'NewResourcePage'
