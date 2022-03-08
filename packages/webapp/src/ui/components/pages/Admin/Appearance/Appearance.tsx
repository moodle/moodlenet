import { Trans } from '@lingui/macro'
import { useContext } from 'react'
import { setOpacity } from '../../../../../helpers/utilities'
import { withCtrl } from '../../../../lib/ctrl'
import { Organization } from '../../../../types'
import Card from '../../../atoms/Card/Card'
import Colorpicker from '../../../atoms/Colorpicker/Colorpicker'
import InputTextField from '../../../atoms/InputTextField/InputTextField'
import StyleContext from '../Style'
import './styles.scss'

export type AppearanceProps = {
  organization: Pick<Organization, 'logo' | 'url' | 'smallLogo'>
}

const Appearance = withCtrl<AppearanceProps>(({ organization }) => {
  const styleContext = useContext(StyleContext)

  const setColor = (color: string) => {
    styleContext.setStyle({
      ...styleContext.style,
      '--primary-color': color,
      '--primary-background-color': setOpacity(color, 0.25),
    })
  }

  return (
    <div className="appearance">
      <Card>
        <h1>
          <Trans>Appearance</Trans>
        </h1>
        <div>
          <Trans>Manage the look and feel of the platform</Trans>
        </div>
      </Card>
      <Card className="logos">
        <h2>
          <Trans>Logos</Trans>
        </h2>
        <div>
          <h3>Logo</h3>
          <img className="logo big" src={organization.logo} alt="Logo" />
        </div>
        <div>
          <h3>Compact logo</h3>
          <img
            className="logo small"
            src={organization.smallLogo}
            alt="small Logo"
          />
        </div>
      </Card>
      <Card className="color">
        <h2>
          <Trans>Color</Trans>
        </h2>
        <div>
          <Trans>
            Define the primary color, the full plattete will calculated
            accordingly
          </Trans>
        </div>
        <div className="field">
          <Colorpicker
            value={styleContext.style['--primary-color']}
            onChange={(c) => setColor(c.currentTarget.value)}
          />
          <InputTextField
            edit={true}
            value={styleContext.style['--primary-color']}
            onChange={(c) => setColor(c.currentTarget.value)}
          />
        </div>
      </Card>
      <Card className="scss">
        <h2>
          <Trans>SCSS</Trans>
        </h2>
        <div>
          <InputTextField textarea={true} edit={true} />
        </div>
      </Card>
    </div>
  )
})

export default Appearance
