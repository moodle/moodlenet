import { layoutPropsWithChildren } from '../../../lib/server/utils/slots'
import { Card } from '../../../ui/atoms/Card/Card'
import './settings.style.scss'

export default async function SettingsLayout(props: layoutPropsWithChildren) {
  return (
    <div className={`user-settings`}>
      {
        <div className="menu-container" role="navigation">
          <Card role="navigation" className="menu">
            {/* settingsItems.map(settingsItem => {
          const isCurrent = JSON.stringify(settingsItem) === JSON.stringify(currSettingsItem)
          const onClick = isCurrent ? undefined : () => chooseSettingsItem(settingsItem)

          return (
            <div
              key={settingsItem.key}
              className={`section ${isCurrent ? 'selected' : ''}`}
              onClick={onClick}
            >
              <div className={`border-container ${isCurrent ? 'selected' : ''}`}>
                <div className={`border ${isCurrent ? 'selected' : ''}`} />
              </div>
              <div className={`content ${isCurrent ? 'selected' : ''}`}>
                {<settingsItem.Menu />}
              </div>
            </div>
          )
        }) */}
          </Card>
        </div>
      }

      <div className="content">{props.children}</div>
    </div>
  )
}
