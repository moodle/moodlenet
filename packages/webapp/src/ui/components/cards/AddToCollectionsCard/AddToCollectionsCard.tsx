import { Trans } from '@lingui/macro'
import { useEffect, useReducer, useState } from 'react'
import { withCtrl } from '../../../lib/ctrl'
import Card from '../../atoms/Card/Card'
import './styles.scss'

export type AddToCollectionsCardProps = {
  setAddToCollections: (selectedCollections: string[]) => unknown
  value?: string[] | undefined
  allCollections: string[]
  header?: boolean
  noCard?: boolean
}

export const AddToCollectionsCard = withCtrl<AddToCollectionsCardProps>(
  ({ allCollections, value, header, noCard, setAddToCollections = () => {} }) => {
    const [selectedCollections, setSelectedCollections] = useState<string[]>(
      value ? value : [],
    )

    useEffect(() => {
      console.log(value)
      setSelectedCollections(value || [])
    }, [value])

    const [selectCollections, toggleSelectedCollection] = useReducer(
      (prevSelected: string[] = selectedCollections, collection: string) => {
        const nextSelectedColl = prevSelected.includes(collection)
          ? prevSelected.filter(_ => _ !== collection)
          : [...prevSelected, collection]
        setAddToCollections(nextSelectedColl)
        return nextSelectedColl
      },
      [],
    )

    console.log(value)

    const collectionList = allCollections.map((value, index) => {
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
      <div className="add-to-collections-card">
        <div className="content">
          <Card noCard={noCard}>
            {header && (
              <div className="collections-header">
                <Trans>Select Collections</Trans>
                {/*<Searchbox setSearchText={setSearchText} searchText="" placeholder={t`Find more collections`} />*/}
              </div>
            )}
            <div className="collections tags">{collectionList}</div>
          </Card>
        </div>
      </div>
    )
  },
)

AddToCollectionsCard.defaultProps = {
  header: true,
}
