import { t, Trans } from '@lingui/macro'
import React from 'react'
import Card from '../../../components/atoms/Card/Card'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import Searchbox from '../../../components/atoms/Searchbox/Searchbox'
import SecondaryButton from '../../../components/atoms/SecondaryButton/SecondaryButton'
import { withCtrl } from '../../../lib/ctrl'
import { FormikBag } from '../../../lib/formik'
import { NewResourceFormValues } from '../types'
import './styles.scss'

export type AddToCollectionsProps = {
  step: 'AddToCollectionsStep'
  formBag: FormikBag<NewResourceFormValues>
  imageUrl: string
  previousStep: (() => unknown) | undefined
  nextStep: (() => unknown) | undefined
  collections: string[]
  setSearchText(text: string): unknown
}

export const AddToCollections = withCtrl<AddToCollectionsProps>(({ collections, setSearchText, nextStep, previousStep }) => {

  const selectCollection = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.classList.contains('selected')) {
      e.currentTarget.classList.remove("selected");
    } else {
      e.currentTarget.classList.add("selected");
    }
  }

  const collectionList = collections.map((value, index) => {
    return (
      <div key={index} className="collection-name tag" onClick={selectCollection}>
        {value}
      </div>
    )
  })
 
  return (
    <div className="upload-resource">
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
        <SecondaryButton onClick={previousStep} type="grey">
          <Trans>Back</Trans>
        </SecondaryButton>
        <PrimaryButton disabled={!nextStep} onClick={nextStep}>
          <Trans>Next</Trans>
        </PrimaryButton>
      </div>
    </div>
  )
})
