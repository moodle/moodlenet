import { t, Trans } from '@lingui/macro'
import { useReducer } from 'react'
import { withCtrl } from '../../../../lib/ctrl'
import Card from '../../../atoms/Card/Card'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import Searchbox from '../../../atoms/Searchbox/Searchbox'
import SecondaryButton from '../../../atoms/SecondaryButton/SecondaryButton'
import './styles.scss'

export type AddResourcesProps = {
  step: 'AddResourcesStep'
  previousStep: (() => unknown) | undefined
  nextStep: (() => unknown) | undefined
  setAddResources: (selectedCollections: string[]) => unknown
  collections: string[]
  setSearchText?(text: string): unknown
}

export const AddResources = withCtrl<AddResourcesProps>(
  ({
    collections,
    setAddResources,
    setSearchText = () => {},
    nextStep,
    previousStep,
  }) => {
    const [selectCollections, toggleSelectedCollection] = useReducer(
      (prevSelected: string[], coll: string) => {
        const nextSelectedColl = prevSelected.includes(coll)
          ? prevSelected.filter((_) => _ !== coll)
          : [...prevSelected, coll]
        setAddResources(nextSelectedColl)
        return nextSelectedColl
      },
      []
    )

    const collectionList = collections.map((value, index) => {
      return (
        <div
          key={index}
          className={`collection-name tag ${
            selectCollections.includes(value) ? 'selected' : ''
          }`}
          onClick={() => toggleSelectedCollection(value)}
        >
          {value}
        </div>
      )
    })

    return (
      <div className="add-resources">
        <div className="content">
          <Card>
            <div className="collections-header">
              <Trans>Select Collections</Trans>
              <Searchbox
                setSearchText={setSearchText}
                searchText=""
                placeholder={t`Find more collections`}
              />
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
  }
)
