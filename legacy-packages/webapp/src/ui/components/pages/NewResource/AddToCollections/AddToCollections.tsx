import { Trans } from '@lingui/macro'
import { withCtrl } from '../../../../lib/ctrl'
import { SelectOptionsMulti } from '../../../../lib/types'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../atoms/SecondaryButton/SecondaryButton'
import {
  AddToCollectionsCard,
  OptionItem,
  OptionItemProp,
} from '../../../molecules/cards/AddToCollectionsCard/AddToCollectionsCard'
import { useNewResourcePageCtx } from '../NewResource'
import './styles.scss'

export type AddToCollectionsProps = {
  collections: SelectOptionsMulti<OptionItemProp>
}

export const AddToCollections = withCtrl<AddToCollectionsProps>(
  ({ collections }) => {
    const { nextForm, prevForm, form } = useNewResourcePageCtx()
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
          <PrimaryButton onClick={nextForm}>
            <Trans>Next</Trans>
          </PrimaryButton>
        </div>
      </div>
    )
  }
)
