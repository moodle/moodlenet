import type { FC } from 'react'
import { Moderation } from '../../../ui/exports/ui.mjs'
import { useAdminModerationProps } from './AdminModerationHooks'

export const AdminModerationContainer: FC = () => {
  const ModerationProps = useAdminModerationProps()
  return <Moderation {...ModerationProps} />
}

export const AdminModerationMenu: FC = () => <span>Moderation</span>
