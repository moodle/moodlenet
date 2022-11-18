import {
  AddonItem,
  Card,
  InputTextField,
  Loading,
  PrimaryButton,
  Snackbar,
} from '@moodlenet/component-library'
import { KeyboardArrowLeftRounded, KeyboardArrowUpRounded } from '@mui/icons-material'
import { useFormik } from 'formik'
import { FC, useState } from 'react'
import ExtensionsList from '../../organisms/ExtensionsList/ExtensionsList.js'
import ExtensionInfo from '../ExtensionInfo/ExtensionInfo.js'
import { ExtensionType } from '../Extensions/Extensions.js'
import './InstallExtension.scss'

export type InstallExtensionFormValues = {
  localPath: string
}

// const DevModeBtn: FC = () => {
//   const { devMode, setDevMode } = useContext(MainContext)

//   return (
//     <div className="dev-mode">
//       <span className="label">Developer mode</span>
//       <Switch enabled={!!devMode} size="medium" onClick={() => setDevMode(p => !p)} />
//     </div>
//   )
// }
// const DevModeBtnAddon: HeaderRightComponentRegItem = { Component: DevModeBtn }

export const InstallExtensionMenu: AddonItem = {
  Item: () => <span>Extensions</span>,
  key: 'menu-install-extensions',
}

export type InstallExtensionProps = {
  form: ReturnType<typeof useFormik<InstallExtensionFormValues>>
  devMode: boolean
  extensions: ExtensionType[]
  isInstalling?: boolean
  installSucces?: boolean
  setIsInstalling: () => void
  setShowManageExtensions?: React.Dispatch<React.SetStateAction<boolean>>
}

const InstallExtension: FC<InstallExtensionProps> = ({
  form,
  devMode,
  extensions,
  isInstalling,
  installSucces,
  setIsInstalling,
  setShowManageExtensions,
}) => {
  const [selectedExt, setSelectedExt] = useState<ExtensionType | undefined>()
  const [showInstallExtension, setShowInstallExtension] = useState(false)
  const shouldShowErrors = !!form.submitCount
  const canSubmit = form.dirty && form.isValid && !form.isSubmitting && !form.isValidating

  const selectExtension = (ext: ExtensionType) => {
    setSelectedExt(ext)
    setShowManageExtensions && setShowManageExtensions(false)
  }
  const diselectExtension = () => {
    setSelectedExt(undefined)
    setShowManageExtensions && setShowManageExtensions(true)
  }

  return (
    <>
      {installSucces && (
        <Snackbar type="success" autoHideDuration={4000}>
          Extensions installed
        </Snackbar>
      )}
      {!selectedExt && (
        <div className="install-extension">
          <Card className="title" onClick={() => setShowInstallExtension(!showInstallExtension)}>
            <div className="title">Install extension</div>
            {showInstallExtension ? <KeyboardArrowUpRounded /> : <KeyboardArrowLeftRounded />}
          </Card>
          {devMode && showInstallExtension && (
            <Card>
              <div className="subtitle">From local package</div>
              <div className="option">
                <div className="name">Local path</div>
                <div className="actions">
                  <InputTextField
                    className="local-path"
                    placeholder="Local path to package"
                    defaultValue={form.values.localPath}
                    value={form.values.localPath}
                    onChange={form.handleChange}
                    name="packageName"
                    key="package-name"
                    error={shouldShowErrors && form.errors.localPath}
                  />
                  <PrimaryButton
                    className={`${isInstalling ? 'loading' : ''}`}
                    disabled={canSubmit}
                    noHover={isInstalling}
                    onClick={setIsInstalling}
                  >
                    <div
                      className="loading"
                      style={{ visibility: isInstalling ? 'visible' : 'hidden' }}
                    >
                      <Loading color="white" />
                    </div>
                    <div
                      className="label"
                      style={{ visibility: isInstalling ? 'hidden' : 'visible' }}
                      onClick={form.submitForm}
                    >
                      Install
                    </div>
                  </PrimaryButton>
                </div>
              </div>
            </Card>
          )}
          {showInstallExtension && (
            <ExtensionsList
              extensions={extensions}
              setSelectedExt={selectExtension}
              title="Compatible extensions"
            />
          )}
        </div>
      )}
      {selectedExt && <ExtensionInfo extension={selectedExt} onClickBackBtn={diselectExtension} />}
    </>
  )
}
InstallExtension.displayName = 'InstallExtension'
export default InstallExtension
