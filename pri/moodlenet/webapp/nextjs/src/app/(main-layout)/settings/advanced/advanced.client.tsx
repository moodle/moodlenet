'use client'
import { useState } from 'react'
import { Trans } from 'react-i18next'
import { Card } from '../../../../ui/atoms/Card/Card'
import { Modal } from '../../../../ui/atoms/Modal/Modal'
import { PrimaryButton } from '../../../../ui/atoms/PrimaryButton/PrimaryButton'
import { SecondaryButton } from '../../../../ui/atoms/SecondaryButton/SecondaryButton'
import { Snackbar } from '../../../../ui/atoms/Snackbar/Snackbar'
import './advanced.style.scss'
import { _any } from '@moodle/lib-types'
import { requestAccountSelfDeletion } from './advanced.server'

export function AdvancedMenu() {
  return (
    <abbr title="Advanced">
      <Trans>Advanced</Trans>
    </abbr>
  )
}

interface AdvancedSettingsProps {
  instanceName: string
}

export function AdvancedSettings({ instanceName }: AdvancedSettingsProps) {
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)

  const snackbars: _any[] = [
    // deleteAccountSuccess ? (
    //   <Snackbar type="success">
    //     <Trans>Check your email to confirm the deletion</Trans>
    //   </Snackbar>
    // ) : null,
  ]

  const modals = (
    <>
      {showDeleteAccountModal && (
        <Modal
          title={`Alert`}
          actions={
            <PrimaryButton
              onClick={() => {
                requestAccountSelfDeletion()
                setShowDeleteAccountModal(false)
              }}
              color="red"
            >
              <Trans>Delete account</Trans>
            </PrimaryButton>
          }
          onClose={() => setShowDeleteAccountModal(false)}
          style={{ maxWidth: '400px' }}
          className="delete-message"
        >
          <Trans>An email will be send to confirm the deletion of your account.</Trans>
        </Modal>
      )}
    </>
  )

  return (
    <div className="advanced" key="advanced">
      {modals}
      {snackbars}
      <Card className="column">
        <div className="title">Advanced</div>
      </Card>
      <Card className="column">
        <div className="parameter">
          <div className="name">Leave {instanceName}</div>
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
