import { Trans } from '@lingui/macro'
import { withCtrl } from '../../../../lib/ctrl'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../atoms/SecondaryButton/SecondaryButton'
import {
  AddToCollectionsCard,
  CollectionItem,
} from '../../../molecules/cards/AddToCollectionsCard/AddToCollectionsCard'
import './styles.scss'

export type AddToCollectionsProps = {
  step: 'AddToCollectionsStep'
  previousStep: (() => unknown) | undefined
  nextStep: (() => unknown) | undefined
  setAddToCollections: (selectedCollections: CollectionItem[]) => unknown
  collections: CollectionItem[]
  selectedCollections: CollectionItem[]
  setSearchText?(text: string): unknown
}

export const AddToCollections = withCtrl<AddToCollectionsProps>(
  ({
    collections,
    setAddToCollections,
    nextStep,
    previousStep,
    selectedCollections,
  }) => {
    return (
      <div className="add-to-collections">
        <AddToCollectionsCard
          value={selectedCollections}
          allCollections={collections}
          setAddToCollections={setAddToCollections}
        />
        <div className="footer">
          <SecondaryButton onClick={previousStep} color="grey">
            <Trans>Back</Trans>
          </SecondaryButton>
          <PrimaryButton disabled={!nextStep} onClick={nextStep}>
            <Trans>Next</Trans>
          </PrimaryButton>
        </div>
      </div>
    )
  }
)
