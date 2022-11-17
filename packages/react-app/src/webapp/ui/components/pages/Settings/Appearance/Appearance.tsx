// import { Trans } from '@lingui/macro'
import {
  AddonItem,
  Card,
  Colorpicker,
  InputTextField,
  PrimaryButton,
  RoundButton,
  useImageUrl
} from '@moodlenet/component-library'
import { useFormik } from 'formik'
import { FC, useCallback, useRef } from 'react'
import { getAppearanceDataStyle } from '../../../../../../common/index.mjs'
import { CustomStyleType } from '../../../../../../common/types.mjs'
import defaultSmallLogo from '../../../../assets/logos/moodlenet-logo-small.png'
import defaultLogo from '../../../../assets/logos/moodlenet-logo.png'
// import { Organization } from '../../../../types'
import './Appearance.scss'

export type AppearanceFormValues = {
  logo: string
  smallLogo: string
  color: string
  //TODO: decide if having this as optional
  customStyle: CustomStyleType
}

export type AppearanceProps = {
  // organization: Pick<Organization, 'logo' | 'url' | 'smallLogo'>
  form: ReturnType<typeof useFormik<AppearanceFormValues>>
}

export const AppearanceMenu: AddonItem = {
  Item: () => <span>Appearance</span>,
  key: 'menu-appearance',
}

export const Appearance: FC<AppearanceProps> = ({ form }) => {
  // const styleContext = useContext(SettingsCtx)
  // const [logo, setLogo] = useState(true)
  // const [compactLogo, setCompactLogo] = useState(true)

  const setColor = useCallback(
    (color: string) => {
      form.setValues({ ...form.values, ...getAppearanceDataStyle(color) })
    },
    [form],
  )

  const [logoUrl] = useImageUrl(form.values.logo, defaultLogo)

  const uploadLogoRef = useRef<HTMLInputElement>(null)
  const selectLogo = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    uploadLogoRef.current?.click()
  }

  const uploadLogo = (e: React.ChangeEvent<HTMLInputElement>) =>
    form.setFieldValue('logo', e.currentTarget.files?.item(0))

  const editLogoButton = [
    <input
      ref={uploadLogoRef}
      type="file"
      accept=".jpg,.jpeg,.png,.gif"
      onChange={uploadLogo}
      key="edit-avatar-input"
      hidden
    />,
    <RoundButton
      className="change-logo-button"
      type="edit"
      abbrTitle={/* t */ `Edit profile picture`}
      onClick={selectLogo}
      key="edit-logo-btn"
    />,
  ]

  const [smallLogoUrl] = useImageUrl(form.values.logo, defaultSmallLogo)

  const uploadSmallLogoRef = useRef<HTMLInputElement>(null)
  const selectSmallLogo = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    uploadSmallLogoRef.current?.click()
  }

  const uploadSmallLogo = (e: React.ChangeEvent<HTMLInputElement>) =>
    form.setFieldValue('logo', e.currentTarget.files?.item(0))

  const editSmallLogoButton = [
    <input
      ref={uploadSmallLogoRef}
      type="file"
      accept=".jpg,.jpeg,.png,.gif"
      onChange={uploadSmallLogo}
      key="edit-avatar-input"
      hidden
    />,
    <RoundButton
      className="change-small-logo-button"
      type="edit"
      abbrTitle={/* t */ `Edit profile picture`}
      onClick={selectSmallLogo}
      key="edit-small-logo-btn"
    />,
  ]

  // const setStyle = (style: string) => {
  //   // const result = sass.compileString(style)
  //   styleContext.setStyle({
  //     ...styleContext.style,
  //     ...(style as CSSProperties),
  //   })
  // }
  const canSubmit = form.dirty && form.isValid && !form.isSubmitting && !form.isValidating
  return (
    <div className="appearance" key="appearance">
      <Card className="main-card column">
        <div className="title">
          {/* <Trans> */}
          Appearance
          {/* </Trans> */}
          <PrimaryButton onClick={form.submitForm} disabled={!canSubmit} className="save-btn">
            {/* <Trans> */}
            Save
            {/* </Trans> */}
          </PrimaryButton>
        </div>
        <div>
          Manage the look and feel of the platform
          {/* <Trans>Manage the look and feel of the platform</Trans> */}
        </div>
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
        <div className="color section">
          <div className="subtitle">
            Color
            {/* <Trans>Color</Trans> */}
          </div>
          <div>
            Choose the primary color defining the whole color palette
            {/* <Trans>Define the primary color defining the whole color palette</Trans> */}
          </div>
          <div className="field">
            <Colorpicker
              value={form.values.color}
              // value={styleContext.style['--primary-color']}
              onChange={(e: React.FormEvent<HTMLInputElement>) => setColor(e.currentTarget.value)}
            />
            <InputTextField
              edit={true}
              value={form.values.color}
              // value={styleContext.style['--primary-color']}
              onChange={(e: React.FormEvent<HTMLInputElement>) => setColor(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="logos section">
          <div className="subtitle">Logos</div>
          <div className="field">
            <div className="parameter">
              <div className="name">Default</div>
              <div className="logo-container">
                <img className="logo" src={logoUrl}></img>
                {editLogoButton}
              </div>
            </div>
            <div className="parameter">
              <div className="name">Small</div>
              <div className="logo-container">
                <img className="logo" src={smallLogoUrl} />
                {editSmallLogoButton}
              </div>
            </div>
          </div>
        </div>
        <div className="scss section">
          <div className="subtitle">
            SCSS
            {/* <Trans>SCSS</Trans> */}
          </div>
          <InputTextField
            textarea={true}
            edit /* onChange={c => setStyle(c.currentTarget.value)} */
          />
        </div>
      </Card>
    </div>
  )
}

export default Appearance
