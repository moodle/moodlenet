import { Trans } from '@lingui/macro'
import { FC, ReactNode, useEffect, useReducer, useState } from 'react'
import Card from '../../../atoms/Card/Card'
import './styles.scss'

export type CollectionItem<Id = any> = { label: ReactNode; id: Id }
export type AddToCollectionsCardProps = {
  setAddToCollections: (selectedCollections: CollectionItem[]) => unknown
  value?: CollectionItem[] | undefined
  allCollections: CollectionItem[]
  header?: boolean
  noCard?: boolean
}

export const AddToCollectionsCard: FC<AddToCollectionsCardProps> = ({
  allCollections,
  value,
  header,
  noCard,
  setAddToCollections,
}) => {
  const [selectedCollections, setSelectedCollections] = useState<CollectionItem[]>(value ? value : [])

  const [selectCollections, toggleSelectedCollection] = useReducer(
    (prevSelected: CollectionItem[] = selectedCollections, collection: CollectionItem | CollectionItem[]) => {
      if (Array.isArray(collection)) {
        return collection
      }
      const nextSelectedColl = prevSelected.map(({ id }) => id).includes(collection.id)
        ? prevSelected.filter(({ id }) => id !== collection.id)
        : [...prevSelected, collection]
      // FIXME: should not call this in useReducer,
      // useReducer should not cause side effects
      // otherways causes packages/webapp/src/ui/components/pages/Resource/Ctrl/ResourcePageCtrl.ts#~350 (calls twice, at least in dev mode)
      // https://github.com/facebook/react/issues/16295#issuecomment-609809355
      setAddToCollections(nextSelectedColl)
      return nextSelectedColl
    },
    [],
  )

  useEffect(() => {
    console.log(value)
    setSelectedCollections(value || [])
    toggleSelectedCollection(value || [])
  }, [value])

  console.log({ value })

  const collectionList = allCollections.map((value, index) => {
    return (
      <div
        key={index}
        className={`collection-name tag ${selectCollections.map(({ id }) => id).includes(value.id) ? 'selected' : ''}`}
        onClick={() => toggleSelectedCollection(value)}
      >
        {value.label}
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
}

AddToCollectionsCard.defaultProps = {
  header: true,
}
