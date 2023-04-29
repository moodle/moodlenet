import {
  AddToCollectionsCard,
  Modal,
  OptionItem,
  OptionItemProp,
  PrimaryButton,
  SecondaryButton,
} from '@moodlenet/component-library'
import { SelectOptionsMulti } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import { FC, useState } from 'react'

export type AddToCollectionButtonProps = {
  collections: SelectOptionsMulti<OptionItemProp>
  selectedCollections: string[]
  setCollections: (collections: string[]) => void
}

export const AddToCollectionButton: FC<AddToCollectionButtonProps> = ({
  collections,
  selectedCollections,
  setCollections,
}) => {
  const [isAddingToCollection, setIsAddingToCollection] = useState<boolean>(false)

  const form = useFormik<{ collections: string[] }>({
    initialValues: { collections: selectedCollections },
    onSubmit: values => {
      return setCollections(values.collections)
    },
  })

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
        multiple
        name="addToCollections"
        onChange={e => {
          form.handleChange(e) //@ALE something is wrong here, it doesn't update the formik state, it has something to do with your Selector component
          form.submitForm()
        }}
        value={collections.selected.map(({ value }) => value)}
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
