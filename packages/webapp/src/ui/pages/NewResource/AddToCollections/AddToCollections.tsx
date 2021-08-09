import { t, Trans } from '@lingui/macro'
import { useReducer } from 'react'
import Card from '../../../components/atoms/Card/Card'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import Searchbox from '../../../components/atoms/Searchbox/Searchbox'
import SecondaryButton from '../../../components/atoms/SecondaryButton/SecondaryButton'
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
  ({ collections, setAddToCollections, setSearchText = () => {}, nextStep, previousStep }) => {
    const [selectCollections, toggleSelectedCollection] = useReducer((prevSelected: string[], coll: string) => {
      const nextSelectedColl = prevSelected.includes(coll)
        ? prevSelected.filter(_ => _ !== coll)
        : [...prevSelected, coll]
      setAddToCollections(nextSelectedColl)
      return nextSelectedColl
    }, [])

    const collectionList = collections.map((value, index) => {
      return (
        <div
          key={index}
          className={`collection-name tag ${selectCollections.includes(value) ? 'selected' : ''}`}
          onClick={() => toggleSelectedCollection(value)}
        >
          {value}
        </div>
      )
    })

    return (
      <div className="add-to-collections">
        <div className="content">
          <Card>
            <div className="collections-header">
              <Trans>Select Collections</Trans>
              <Searchbox setSearchText={setSearchText} searchText="" placeholder={t`Find more collections`} />
            </div>
            <div className="collections tags">{collectionList}</div>
          </Card>
        </div>
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
