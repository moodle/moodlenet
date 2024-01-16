/* eslint-disable prettier/prettier */
import type { AddonItem } from '@moodlenet/component-library'
import {
  Card,
  Modal,
  PrimaryButton,
  SecondaryButton,
  Snackbar,
  Switch,
} from '@moodlenet/component-library'
import { useState, type FC } from 'react'
import './Advanced.scss'

export type AdvancedProps = {
  mainColumnItems: (AddonItem | null)[]
  appearOnLeaderboard: boolean
  setAppearOnLeaderboard: (appearOnLeaderboard: boolean) => void
  showFollowing: boolean
  setShowFollowing: (showFollowing: boolean) => void
  deleteAccount: () => void
  deleteAccountSuccess: boolean
  instanceName: string
}

export const AdvancedMenu = () => <abbr title="Advanced">Advanced</abbr>

export const Advanced: FC<AdvancedProps> = ({
  mainColumnItems,
  setAppearOnLeaderboard,
  appearOnLeaderboard,
  setShowFollowing,
  showFollowing,
  deleteAccount,
  deleteAccountSuccess,
  instanceName,
}) => {
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)

  const appearOnLeaderboardField = (
    <div className="switch-parameter">
      <div className="title">Appear on user leaderboards</div>
      <Switch
        enabled={appearOnLeaderboard}
        toggleSwitch={() => setAppearOnLeaderboard(appearOnLeaderboard)}
      />
    </div>
  )

  const showFollowingField = (
    <div className="switch-parameter">
      <div className="title">Show who and what I'm following</div>
      <Switch enabled={showFollowing} toggleSwitch={() => setShowFollowing(showFollowing)} />
    </div>
  )

  const privacyFields = [appearOnLeaderboardField, showFollowingField]

  const privacySection = (
    <Card className="column">
      <div className="parameter">
        <div className="name">Privacy</div>
        {/* <div className="actions"> */}
        {/* <SecondaryButton onClick={() => setShowDeleteAccountModal(true)}> */}
        {/* Delete account */}
        {/* </SecondaryButton> */}
        {/* </div> */}
        {privacyFields}
      </div>
    </Card>
  )

  const leaveSection = (
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
  )

  const updatedMainColumnItems = [privacySection, leaveSection, ...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const snackbars =
    // <SnackbarStack
    // snackbarList={
    [
      deleteAccountSuccess ? (
        <Snackbar type="success">Check your email to confirm the deletion</Snackbar>
      ) : null,
    ]
  // }
  // ></SnackbarStack>

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
          An email will be send to confirm the deletion of your account.
        </Modal>
      )}
    </>
  )

  return (
    <div className="advanced" key="advanced">
      {modals}
      {snackbars}
      <Card className="column">
        <div className="title">
          Advanced
          {/* <PrimaryButton onClick={form.submitForm} disabled={!canSubmit} className="save-btn">
            Save
          </PrimaryButton> */}
        </div>
      </Card>
      {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      {/* <Card className="column">
        <div className="parameter">
          <div className="name"> Platform name</div>
          <div className="actions">
            <InputTextField
              className="instance-name"
              placeholder="Enter name of your LMS platform"
              defaultValue={form.values.instanceName}
              onChange={form.handleChange}
              name="instanceName"
              key="instance-name"
              error={shouldShowErrors && form.errors.instanceName}
            />
          </div>
        </div>
      </Card> */}
    </div>
  )
}
