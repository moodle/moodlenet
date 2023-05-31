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
import './Access.scss'

export type AccessProps = {
  mainColumnItems: (AddonItem | null)[]
  deleteAccount: () => void
  deleteAccountSuccess: boolean
}

export const AccessMenu = () => <abbr title="Access">Access</abbr>

export const Access: FC<AccessProps> = ({
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
    <div className="Access" key="Access">
      {modals}
      {snackbars}
      <Card className="column">
        <div className="title">
          {/* <Trans> */}
          Access
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
