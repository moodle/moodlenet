// import { Trans } from '@lingui/macro'
import { CSSProperties, FC, useContext } from 'react'
import { getColorPalette } from '../../../styles/utilities'
// import { Organization } from '../../../../types'
import { Card, InputTextField, PrimaryButton } from '../../atoms'
import Colorpicker from '../../atoms/Colorpicker/Colorpicker'
import './Appearance.scss'
import { SettingsCtx } from './SettingsContext'

export type AppearanceProps = {
  // organization: Pick<Organization, 'logo' | 'url' | 'smallLogo'>
}

export const Appearance: FC<AppearanceProps> = (
  {
    /* organization */
  },
) => {
  const styleContext = useContext(SettingsCtx)
  // const [logo, setLogo] = useState(true)
  // const [compactLogo, setCompactLogo] = useState(true)

  const setColor = (color: string) => {
    styleContext.setStyle({
      ...styleContext.style,
      ...getColorPalette(color),
      // '--primary-color': color,
      // '--primary-background-color': setOpacity(color, 0.25),
    })
  }
  const setStyle = (style: string) => {
    // const result = sass.compileString(style)
    styleContext.setStyle({
      ...styleContext.style,
      ...(style as CSSProperties),
    })
  }

  return (
    <div className="appearance">
      <Card className="appearance-header">
        <h1>
          Appearance
          {/* <Trans>Appearance</Trans> */}
          <PrimaryButton>
            Apply
            {/* <Trans>Apply</Trans> */}
          </PrimaryButton>
        </h1>
        <div>
          Manage the look and feel of the platform
          {/* <Trans>Manage the look and feel of the platform</Trans> */}
        </div>
      </Card>
      {/* <Card className="logos">
        <h2>
          <Trans>Logos</Trans>
        </h2>
        <div>
          <h3>Default</h3>
          {logo ? (
            <div className="logo-container">
              <img className="logo big" src={organization.logo} alt="Logo" />
              <SecondaryButton onClick={() => setLogo(false)} color="grey">
                Delete
              </SecondaryButton>
            </div>
          ) : (
            <FileUploader type="image" />
          )}
        </div>
        <div>
          <h3>Compact</h3>
          {compactLogo ? (
            <div className="logo-container">
              <img
                className="logo small"
                src={organization.smallLogo}
                alt="small Logo"
              />
              <SecondaryButton
                onClick={() => setCompactLogo(false)}
                color="grey"
              >
                Delete
              </SecondaryButton>
            </div>
          ) : (
            <FileUploader type="image" />
          )}
        </div>
      </Card> */}
      <Card className="color">
        <h2>
          Color
          {/* <Trans>Color</Trans> */}
        </h2>
        <div>
          Define the primary color defining the whole color palette
          {/* <Trans>Define the primary color defining the whole color palette</Trans> */}
        </div>
        <div className="field">
          <Colorpicker
            value={styleContext.style['--primary-color']}
            onChange={(e: React.FormEvent<HTMLInputElement>) => setColor(e.currentTarget.value)}
          />
          <InputTextField
            edit={true}
            value={styleContext.style['--primary-color']}
            onChange={(e: React.FormEvent<HTMLInputElement>) => setColor(e.currentTarget.value)}
          />
        </div>
      </Card>
      <Card className="scss">
        <h2>
          SCSS
          {/* <Trans>SCSS</Trans> */}
        </h2>
        <div>
          <InputTextField textarea={true} edit={true} onChange={c => setStyle(c.currentTarget.value)} />
        </div>
      </Card>
    </div>
  )
}

export default Appearance
