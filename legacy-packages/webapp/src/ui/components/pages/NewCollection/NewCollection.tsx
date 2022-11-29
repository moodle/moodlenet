import { Trans } from '@lingui/macro'
import { CP, withCtrl } from '../../../lib/ctrl'
import Snackbar from '../../atoms/Snackbar/Snackbar'
import {
  HeaderPageTemplate,
  HeaderPageTemplateProps,
} from '../../templates/HeaderPageTemplate'
import {
  CreateCollection,
  CreateCollectionProps,
} from './CreateCollection/CreateCollection'
import './styles.scss'

export type NewCollectionState = 'CreateCollection' | 'AddResources'
export type NewCollectionProgressState = [NewCollectionState, string][]

export type NewCollectionProps = {
  stepProps: CreateCollectionProps //| AddToCollectionsProps
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  // CreateCollection: CreateCollectionProps
  // states: NewCollectionProgressState
  // currentState: NewCollectionState
}

//const progressStates = [t`Upload Resource`, t`Add to Resources`]
export const NewCollection = withCtrl<NewCollectionProps>(
  ({ stepProps, headerPageTemplateProps }) => {
    /*const progressCurrentIndex =
    stepProps.step === 'CreateCollectionStep'
      ? 0
      : stepProps.step === 'AddToCollectionsStep'
      ? 1
      : assertNever(stepProps, `Should never happen`)

  if (progressCurrentIndex === undefined) {
    console.error({ stepProps })
    throw new Error(`unknown stepProps: step=${stepProps.step}`)
  }*/

    return (
      <HeaderPageTemplate
        {...headerPageTemplateProps}
        className="light-background"
      >
        {stepProps.form.isSubmitting && (
          <Snackbar
            position="bottom"
            type="info"
            waitDuration={200}
            autoHideDuration={6000}
            showCloseButton={false}
          >
            <Trans>Content uploading, please don't close the tab</Trans>
          </Snackbar>
        )}
        <div className="new-collection">
          {/*<ProgressState
          stateNames={progressStates}
          currentIndex={progressCurrentIndex}
        />*/}
          <div className="content">
            <CreateCollection {...stepProps} />
            {/*{stepProps.step === 'CreateCollectionStep' ? (
            <CreateCollection {...stepProps} />
          ) : stepProps.step === 'AddToCollectionsStep' ? (
            <AddToCollections {...stepProps} />
          ) : (
            assertNever(stepProps, `Should never happen`)
          )}*/}
          </div>
        </div>
      </HeaderPageTemplate>
    )
  }
)
NewCollection.displayName = 'NewCollectionPage'
