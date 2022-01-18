import { Trans } from '@lingui/macro'
import { withCtrl } from '../../../../lib/ctrl'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../atoms/SecondaryButton/SecondaryButton'
import {
  AddToCollectionsCard,
  OptionItem,
  OptionItemProp,
} from '../../../molecules/cards/AddToCollectionsCard/AddToCollectionsCard'
import { useNewResourcePageCtx } from '../NewResource'
import { NewResourceFormValues } from '../types'
import './styles.scss'

export type AddToCollectionsProps = {
  collections: {
    opts: OptionItemProp[]
    selected: OptionItemProp[]
  }
}
const usingFields: (keyof NewResourceFormValues)[] = ['addToCollections']

export const AddToCollections = withCtrl<AddToCollectionsProps>(
  ({ collections }) => {
    const { nextForm, prevForm, form } = useNewResourcePageCtx()
    const isValid = usingFields.reduce(
      (valid, fldName) => valid && !form.errors[fldName],
      true
    )
    return (
      <div className="add-to-collections">
        <AddToCollectionsCard
          multiple
          name="addToCollections"
          onChange={form.handleChange}
          value={collections.selected.map(({ value }) => value)}
        >
          {collections.opts.map(({ label, value }) => (
            <OptionItem key={value} label={label} value={value} />
          ))}
        </AddToCollectionsCard>
        <div className="footer">
          <SecondaryButton onClick={prevForm} color="grey">
            <Trans>Back</Trans>
          </SecondaryButton>
          <PrimaryButton disabled={!isValid} onClick={nextForm}>
            <Trans>Next</Trans>
          </PrimaryButton>
        </div>
      </div>
    )
  }
)
