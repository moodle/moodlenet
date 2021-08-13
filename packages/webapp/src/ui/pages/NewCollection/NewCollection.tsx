import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import { CreateCollection, CreateCollectionProps } from './CreateCollection/CreateCollection'
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
export const NewCollection = withCtrl<NewCollectionProps>(({ stepProps, headerPageTemplateProps }) => {
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
    <HeaderPageTemplate {...headerPageTemplateProps} style={{ backgroundColor: '#f4f5f7' }}>
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
})
NewCollection.displayName = 'NewCollectionPage'