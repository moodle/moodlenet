import { Card } from '@moodlenet/component-library'
import { FC } from 'react'
// import { searchNpmExtensionConfig } from '../../../../../helpers/utilities'
// import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus'
// import vscDarkPlus from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus'
// import vscDarkPlus from 'react-syntax-highlighter'
import { ExtensionType } from '../InstallExtension/InstallExtension.js'
import './ExtensionConfig.scss'

export type ExtensionConfigProps = {
  // configuration? : AddonItem
  extension: ExtensionType
  // onClickBackBtn?(arg0?: unknown): unknown | any
}

const ExtensionConfig: FC<ExtensionConfigProps> = ({ extension }) => {
  const { Item, key } = extension.config ?? { undefined, undefined }

  const modulesList = null /* extension?.modules.map(
    (module: Module, i) =>
      (!module.mandatory || stateContext.devMode) && (
        <div className="module" key={i}>
          <div className="name">{module.name}</div>
          <Switch enabled={module.enabled} mandatory={module.mandatory} />
        </div>
      ),
  ) */

  return (
    <div className="extension-config">
      {Item && key && (
        <Card>
          <Item key={key} />
        </Card>
      )}
      {modulesList && (
        <Card className="modules">
          <div className="title">Modules</div>
          <div className="list">{modulesList}</div>
        </Card>
      )}
      {/* {isInstalling && (
        <div style={{ position: 'fixed', top: '0', bottom: '0', left: '0', right: '0', background: 'rgba(0,0,0,0.6)' }}>
          <h1 style={{ textAlign: 'center', color: 'white' }}>Spinner !</h1>
        </div>
      )} */}
    </div>
  )
}
ExtensionConfig.displayName = 'ExtensionConfig'
export default ExtensionConfig
