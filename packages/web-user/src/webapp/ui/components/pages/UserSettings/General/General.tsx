/* eslint-disable prettier/prettier */
import type { AddonItem } from '@moodlenet/component-library'
import {
  Card,
  Modal,
  PrimaryButton,
  SecondaryButton,
  Snackbar,
  SnackbarStack,
} from '@moodlenet/component-library'
import type { FC } from 'react'
import { useState } from 'react'
import './General.scss'

export type GeneralProps = {
  mainColumnItems: (AddonItem | null)[]
  deleteAccount: () => void
  deleteAccountSuccess: boolean
}

export const GeneralMenu = () => <abbr title="General">General</abbr>

export const General: FC<GeneralProps> = ({
  deleteAccount,
  mainColumnItems,
  deleteAccountSuccess,
}) => {
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)

  const updatedMainColumnItems = [...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const snackbars = (
    <SnackbarStack
      snackbarList={[
        deleteAccountSuccess ? (
          <Snackbar type="success">Check your email to confirm the deletion</Snackbar>
        ) : null,
      ]}
    ></SnackbarStack>
  )

  const modals = (
    <>
      {showDeleteAccountModal && (
        <Modal
          title={`Alert`}
          actions={
            <PrimaryButton
              onClick={() => {
                deleteAccount()
                setShowDeleteAccountModal(false)
              }}
              color="red"
            >
              Delete account
            </PrimaryButton>
          }
          onClose={() => setShowDeleteAccountModal(false)}
          style={{ maxWidth: '400px' }}
          className="delete-message"
        >
          {/* Your account will be deleted. <br /> */}
          {/* Your personal details will be removed. <br /> */}
          {/* Your contributions will be kept as anonymous. <br /> */}
          An email will be send to confirm the deletion of your account.
        </Modal>
      )}
    </>
  )

  return (
    <div className="general" key="general">
      {modals}
      {snackbars}
      <Card className="column">
        <div className="title">
          {/* <Trans> */}
          General
          {/* </Trans> */}
        </div>
      </Card>
      {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      <Card className="column">
        <div className="parameter">
          <div className="name">More</div>
          <div className="actions">
            <SecondaryButton onClick={() => setShowDeleteAccountModal(true)}>
              Delete account
            </SecondaryButton>
          </div>
        </div>
      </Card>
    </div>
  )
}
