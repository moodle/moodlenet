import { Trans } from '@lingui/macro'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../components/atoms/SecondaryButton/SecondaryButton'
import { AddToCollectionsCard } from '../../../components/cards/AddToCollectionsCard/AddToCollectionsCard'
import { withCtrl } from '../../../lib/ctrl'
import './styles.scss'

export type AddToCollectionsProps = {
  step: 'AddToCollectionsStep'
  previousStep: (() => unknown) | undefined
  nextStep: (() => unknown) | undefined
  setAddToCollections: (selectedCollections: string[]) => unknown
  collections: string[]
  setSearchText?(text: string): unknown
}

export const AddToCollections = withCtrl<AddToCollectionsProps>(
  ({ collections, setAddToCollections = () => {}, nextStep, previousStep }) => {
    return (
      <div className="add-to-collections">
        <AddToCollectionsCard allCollections={collections} setAddToCollections={setAddToCollections} />
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
  },
)
