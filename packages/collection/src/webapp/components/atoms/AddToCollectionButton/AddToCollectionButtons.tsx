import type { OptionItemProp } from '@moodlenet/component-library'
import {
  AddToCollectionsCard,
  Modal,
  OptionItem,
  PrimaryButton,
  SecondaryButton,
} from '@moodlenet/component-library'
import type { SelectOptionsMulti } from '@moodlenet/react-app/ui'
import type { FC } from 'react'
import { useMemo, useState } from 'react'

export type AddToCollectionButtonProps = {
  collections: SelectOptionsMulti<OptionItemProp>
  add(collectionId: string): void
  remove(collectionId: string): void
}

export const AddToCollectionButton: FC<AddToCollectionButtonProps> = ({
  collections,
  add,
  remove,
}) => {
  const [isAddingToCollection, setIsAddingToCollection] = useState<boolean>(false)
  const selectedValues = useMemo(
    () => collections.selected.map(({ value }) => value),
    [collections.selected],
  )

  const modal = isAddingToCollection && collections && (
    <Modal
      title={`Select collections`}
      actions={
        <PrimaryButton
          onClick={() => {
            setIsAddingToCollection(false)
          }}
        >
          Done
        </PrimaryButton>
      }
      onClose={() => setIsAddingToCollection(false)}
      style={{ maxWidth: '400px' }}
    >
      <AddToCollectionsCard
        header={false}
        noCard={true}
        onItemSelect={add}
        onItemDeselect={remove}
        value={selectedValues}
      >
        {collections.opts.map(({ label, value }) => (
          <OptionItem key={value} label={label} value={value} />
        ))}
      </AddToCollectionsCard>
    </Modal>
  )

  return (
    <>
      {modal}
      <SecondaryButton onClick={() => setIsAddingToCollection(true)}>
        Add to collection
      </SecondaryButton>
    </>
  )
}
