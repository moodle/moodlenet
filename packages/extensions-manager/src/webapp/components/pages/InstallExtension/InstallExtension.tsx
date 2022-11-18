import {
  AddonItem,
  Card,
  InputTextField,
  Loading,
  PrimaryButton,
  Snackbar,
} from '@moodlenet/component-library'
import { useFormik } from 'formik'
import { FC, useState } from 'react'
import ExtensionsList from '../../organisms/ExtensionsList/ExtensionsList.js'
import ExtensionInfo from '../ExtensionInfo/ExtensionInfo.js'
import './InstallExtension.scss'

export type ExtensionType = {
  name: string
  displayName: string
  description: string
  icon?: string
  readme: string
  mandatory?: boolean
  developedByMoodleNet?: boolean
  installed: boolean
  repositoryUrl: string
  isInstallingUninstalling: boolean
  installUninstallSucces: boolean
  config?: AddonItem
  toggleInstallingUninstalling: () => void
}

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
  Item: () => <span>Install extension</span>,
  key: 'menu-install-extensions',
}

export type InstallExtensionProps = {
  form: ReturnType<typeof useFormik<InstallExtensionFormValues>>
  devMode: boolean
  extensions: ExtensionType[]
  isInstalling?: boolean
  installSucces?: boolean
  setIsInstalling: () => void
}

const InstallExtension: FC<InstallExtensionProps> = ({
  form,
  devMode,
  extensions,
  isInstalling,
  installSucces,
  setIsInstalling,
}) => {
  const [selectedExt, setSelectedExt] = useState<ExtensionType | undefined>()
  const shouldShowErrors = !!form.submitCount
  const canSubmit = form.dirty && form.isValid && !form.isSubmitting && !form.isValidating

  return (
    <>
      {installSucces && (
        <Snackbar type="success" autoHideDuration={4000}>
          Extensions installed
        </Snackbar>
      )}
      {!selectedExt && (
        <div className="install-extension">
          <Card className="title">
            <div className="title">Install extension</div>
          </Card>
          {devMode && (
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
          <ExtensionsList
            extensions={extensions}
            setSelectedExt={setSelectedExt}
            title="Compatible extensions"
          />
        </div>
      )}
      {selectedExt && (
        <ExtensionInfo extension={selectedExt} onClickBackBtn={() => setSelectedExt(undefined)} />
      )}
    </>
  )
}
InstallExtension.displayName = 'InstallExtension'
export default InstallExtension
