// import lib from 'moodlenet-react-app-lib'
import { Card } from '@moodlenet/component-library'
import type { FC } from 'react'

export const AdminSettingsMenu: FC = () => <span>Email Auth</span>

export const AdminSettingsContent: FC = () => (
  <div className="simple-auth" key="simple-auth">
    <Card className="column">
      <div className="title">Email Auth</div>
      <div>Manage extension preferences</div>
    </Card>
  </div>
)
