/* eslint-disable prettier/prettier */
import type { AddonItem } from '@moodlenet/component-library'
import { Card, SecondaryButton, Snackbar, SnackbarStack } from '@moodlenet/component-library'
import { useState, type FC } from 'react'
import './General.scss'

export type GeneralProps = {
  mainColumnItems: (AddonItem | null)[]
  userId: string
}

export const GeneralMenu = () => <abbr title="General">General</abbr>

export const General: FC<GeneralProps> = ({ mainColumnItems, userId }) => {
  const [showUserIdCopiedAlert, setShowUserIdCopiedAlert] = useState<boolean>(false)

  const copyId = () => {
    navigator.clipboard.writeText(userId)
    setShowUserIdCopiedAlert(false)
    setTimeout(() => {
      setShowUserIdCopiedAlert(true)
    }, 100)
  }

  const detailsSection = (
    <Card className="column details-section">
      <div className="parameter">
        <div className="name user-id">
          User ID
          <span>To connect with Moodle LMS</span>
        </div>
        <div className="actions">
          {userId}{' '}
          <abbr className={`user-id`} title={`Click to copy your ID to the clipboard`}>
            <SecondaryButton className="copy-id" onClick={copyId}>
              Copy
            </SecondaryButton>
          </abbr>
        </div>
      </div>
    </Card>
  )

  const updatedMainColumnItems = [detailsSection, ...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const snackbars = (
    <SnackbarStack
      snackbarList={[
        showUserIdCopiedAlert ? (
          <Snackbar
            type="success"
            position="bottom"
            autoHideDuration={6000}
            showCloseButton={false}
          >
            User ID copied to the clipboard
          </Snackbar>
        ) : null,
      ]}
    ></SnackbarStack>
  )

  const modals = [<></>]

  return (
    <div className="general" key="general">
      {modals}
      {snackbars}
      <Card className="column">
        <div className="title">General</div>
      </Card>
      {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
    </div>
  )
}
