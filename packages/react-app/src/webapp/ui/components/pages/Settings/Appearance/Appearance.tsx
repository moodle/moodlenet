// import { Trans } from '@lingui/macro'
import type { AddonItem } from '@moodlenet/component-library'
import { Card, Colorpicker, InputTextField, PrimaryButton } from '@moodlenet/component-library'
import type { useFormik } from 'formik'
import type { FC } from 'react'
import { useCallback /* , useRef */ } from 'react'
import type { AppearanceData } from '../../../../../../common/exports.mjs'
import { getAppearanceStyle } from '../../../../../../common/exports.mjs'
// import defaultSmallLogo from '../../../../assets/logos/moodlenet-logo-small.png'
// import defaultLogo from '../../../../assets/logos/moodlenet-logo.png'
// import { Organization } from '../../../../types'
import './Appearance.scss'

export type AppearanceProps = {
  // organization: Pick<Organization, 'logo' | 'url' | 'smallLogo'>
  form: ReturnType<typeof useFormik<AppearanceData>>
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
      form.setValues({ ...form.values, ...getAppearanceStyle(color) })
    },
    [form],
  )

  // const [logoUrl] = useImageUrl(form.values.logo, defaultLogo)

  // const uploadLogoRef = useRef<HTMLInputElement>(null)
  // const selectLogo = (e: React.MouseEvent<HTMLElement>) => {
  //   e.stopPropagation()
  //   uploadLogoRef.current?.click()
  // }

  // const uploadLogo = (e: React.ChangeEvent<HTMLInputElement>) =>
  //   form.setFieldValue('logo', e.currentTarget.files?.item(0))

  // const editLogoButton = [
  //   <input
  //     ref={uploadLogoRef}
  //     type="file"
  //     accept=".jpg,.jpeg,.png,.gif"
  //     onChange={uploadLogo}
  //     key="edit-avatar-input"
  //     hidden
  //   />,
  //   <RoundButton
  //     className="change-logo-button"
  //     type="edit"
  //     abbrTitle={/* t */ `Edit profile picture`}
  //     onClick={selectLogo}
  //     key="edit-logo-btn"
  //   />,
  // ]

  // const [smallLogoUrl] = useImageUrl(form.values.logo, defaultSmallLogo)

  // const uploadSmallLogoRef = useRef<HTMLInputElement>(null)
  // const selectSmallLogo = (e: React.MouseEvent<HTMLElement>) => {
  //   e.stopPropagation()
  //   uploadSmallLogoRef.current?.click()
  // }

  // const uploadSmallLogo = (e: React.ChangeEvent<HTMLInputElement>) =>
  //   form.setFieldValue('logo', e.currentTarget.files?.item(0))

  // const editSmallLogoButton = [
  //   <input
  //     ref={uploadSmallLogoRef}
  //     type="file"
  //     accept=".jpg,.jpeg,.png,.gif"
  //     onChange={uploadSmallLogo}
  //     key="edit-avatar-input"
  //     hidden
  //   />,
  //   <RoundButton
  //     className="change-small-logo-button"
  //     type="edit"
  //     abbrTitle={/* t */ `Edit profile picture`}
  //     onClick={selectSmallLogo}
  //     key="edit-small-logo-btn"
  //   />,
  // ]

  // const setStyle = (style: string) => {
  //   // const result = sass.compileString(style)
  //   styleContext.setStyle({
  //     ...styleContext.style,
  //     ...(style as CSSProperties),
  //   })
  // }
  const canSubmit = form.dirty && form.isValid && !form.isSubmitting && !form.isValidating

  // const logoSection = (
  //   <div className="logos section">
  //     <div className="subtitle">Logos</div>
  //     <div className="field">
  //       <div className="parameter">
  //         <div className="name">Default</div>
  //         <div className="logo-container">
  //           <img className="logo" src={logoUrl}></img>
  //           {editLogoButton}
  //         </div>
  //       </div>
  //       <div className="parameter">
  //         <div className="name">Small</div>
  //         <div className="logo-container">
  //           <img className="logo" src={smallLogoUrl} />
  //           {editSmallLogoButton}
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )

  // const scssSection = (
  //   <div className="scss section">
  //     <div className="subtitle">
  //       SCSS
  //       {/* <Trans>SCSS</Trans> */}
  //     </div>
  //     <InputTextField
  //       name="scss"
  //       textarea={true}
  //       value={form.values.scss}
  //       onChange={form.handleChange}
  //     />
  //   </div>
  // )

  return (
    <div className="appearance" key="appearance">
      <Card className="column">
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
      </Card>
      <Card className="main-card column">
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
              name="color-colorpicker"
              value={form.values.color}
              onChange={e => setColor(e.currentTarget.value)}
            />
            <InputTextField
              name="color-input"
              value={form.values.color}
              onChange={e => setColor(e.currentTarget.value)}
            />
          </div>
        </div>
        {/* {logoSection}
        {scssSection} */}
      </Card>
    </div>
  )
}

export default Appearance
