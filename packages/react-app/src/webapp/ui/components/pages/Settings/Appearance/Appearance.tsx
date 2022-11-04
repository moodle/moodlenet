// import { Trans } from '@lingui/macro'
import { Card, Colorpicker, InputTextField } from '@moodlenet/component-library'
import { useFormik } from 'formik'
import { FC, useContext } from 'react'
import { AppearanceData } from '../../../../../../main.mjs'
import { getColorPalette } from '../../../../styles/utilities.js'
// import { Organization } from '../../../../types'
import { SettingsCtx, StyleType } from '../SettingsContext.js'
import './Appearance.scss'

export type AppearanceProps = {
  // organization: Pick<Organization, 'logo' | 'url' | 'smallLogo'>
  form: ReturnType<typeof useFormik<AppearanceData>>
  style: StyleType
  setStyle: () => unknown
}

export const AppearanceMenu = <span>Appearance</span>

export const Appearance: FC<AppearanceProps> = ({form, setStyle, style /* { organization } */}) => {
  const styleContext = useContext(SettingsCtx)
  // const [logo, setLogo] = useState(true)
  // const [compactLogo, setCompactLogo] = useState(true)

  const setColor = (color: string) => {
    form.values.color = color
    // styleContext.saveAppearance({ color })
    // styleContext.setStyle({
    setStyle(
      ...style,
      // ...styleContext.style,
      ...getColorPalette(color),
      // '--primary-color': color,
      // '--primary-background-color': setOpacity(color, 0.25),
    )
  }

  // const setStyle = (style: string) => {
  //   // const result = sass.compileString(style)
  //   styleContext.setStyle({
  //     ...styleContext.style,
  //     ...(style as CSSProperties),
  //   })
  // }

  return (
    <div className='appearance' key="appearance">
      <Card className="appearance-header">
        <div className="title">
          Appearance
          {/* <Trans>Appearance</Trans> */}
          {/* <PrimaryButton>
            Apply
            <Trans>Apply</Trans>
          </PrimaryButton> */}
        </div>
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
      <Card className="color-card">
        <div className="subtitle">
          Color
          {/* <Trans>Color</Trans> */}
        </div>
        <div>
          Define the primary color defining the whole color palette
          {/* <Trans>Define the primary color defining the whole color palette</Trans> */}
        </div>
        <div className="field">
          <Colorpicker
            value={style['--primary-color']}
            // value={styleContext.style['--primary-color']}
            onChange={(e: React.FormEvent<HTMLInputElement>) => setColor(e.currentTarget.value)}
          />
          <InputTextField
            edit={true}
            value={style['--primary-color']}
            // value={styleContext.style['--primary-color']}
            onChange={(e: React.FormEvent<HTMLInputElement>) => setColor(e.currentTarget.value)}
          />
        </div>
      </Card>
      <Card className="scss-card">
        <div className="subtitle">
          SCSS
          {/* <Trans>SCSS</Trans> */}
        </div>
        <InputTextField
          textarea={true}
          edit /* onChange={c => setStyle(c.currentTarget.value)} */
        />
      </Card>
    </ div>
  )
}

export default Appearance
