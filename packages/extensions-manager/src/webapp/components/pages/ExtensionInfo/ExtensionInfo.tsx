import { Card, Loading, PrimaryButton, TertiaryButton } from '@moodlenet/component-library'
import { ArrowBack } from '@mui/icons-material'
import { FC, ReactNode, ReactPortal, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
// import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus'
// import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
// import { searchNpmExtensionInfo } from '../../../../../helpers/utilities'
// import { withCtrl } from '../../../../lib/ctrl'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
// import { CoreExt } from '@moodlenet/core'
import rehypeRaw from 'rehype-raw'
import { mandatoryPackages } from '../../../fakeData.js'
import { ExtensionType } from '../InstallExtension/InstallExtension.js'
import './ExtensionInfo.scss'

export type ExtensionInfoProps = {
  // isInstalling: boolean
  // toggleInstallUninstall: (ext: ExtensionType) => void
  // searchPackagesResObject: SearchPackagesResObject
  onClickBackBtn?: (arg0?: unknown) => unknown
  // readme: string
  extension: ExtensionType
}

const ExtensionInfo: FC<ExtensionInfoProps> = ({
  extension,
  // isInstalling,
  // toggleisInstalling,
  onClickBackBtn,
}) => {
  const {
    // isInstallingUninstalling,
    description,
    // installed,
    name,
    readme,
    // toggleInstallingUninstalling,
  } = extension

  const [isInstallingUninstalling, toggleInstallingUninstalling] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    isInstallingUninstalling &&
      setTimeout(() => {
        setInstalled(!installed)
        toggleInstallingUninstalling(!isInstallingUninstalling)
      }, 1000)
  }, [isInstallingUninstalling, installed])
  // toggleisInstalling,
  // searchPackagesResObject,
  // readme,
  // }) => {
  // const { pkgs } = useContext(MainContext)
  // const [myPkg] = pkgs
  // // const stateContext = useContext(StateContext)

  // // const modulesList = extension?.modules.map(
  // //   (module: Module, i) =>
  // //     (!module.mandatory || stateContext?.devMode) && (
  // //       <div className="module" key={i}>
  // //         <div className="name">{module.name}</div>
  // //         <Switch enabled={module.enabled} mandatory={module.mandatory} />
  // //       </div>
  // //     ),
  // // )

  // const install_uninstall = useCallback(() => {
  //   toggleisInstalling()
  //   searchPackagesResObject.installed
  //     ? myPkg.call('uninstall')({
  //         pkgId: searchPackagesResObject.pkgId,
  //       })
  //     : myPkg.call('install')({
  //         installPkgReq: searchPackagesResObject.installPkgReq,
  //       })

  //   // promise.finally(toggleisInstalling)
  // }, [myPkg, searchPackagesResObject, toggleisInstalling])

  type CodeBlockProps = {
    node: any
    children: ReactNode & ReactNode[]
    inline?: boolean | undefined
    className?: string | undefined
  }
  const CodeBlock = {
    code({ node, inline, className, children, ...props }: CodeBlockProps) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <SyntaxHighlighter /* style={vscDarkPlus} */ language={match[1]} PreTag="div" {...props}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        ((
          <code className={className} {...props}>
            {children}
          </code>
        ) as ReactPortal)
      )
    },
  }

  return (
    <div className="extension-info">
      <Card className="header-card">
        <div className="title">
          <div className="title-and-back">
            <TertiaryButton className="back" color="black" onClick={onClickBackBtn}>
              <ArrowBack />
            </TertiaryButton>
            {description.split('\n')[0]}
          </div>
          <PrimaryButton
            className={`install-btn ${isInstallingUninstalling ? 'loading' : ''}`}
            noHover={isInstallingUninstalling}
            disabled={mandatoryPackages.includes(name)}
            onClick={toggleInstallingUninstalling}
          >
            <div
              className="loading"
              style={{ visibility: isInstallingUninstalling ? 'visible' : 'hidden' }}
            >
              <Loading color="white" />
            </div>
            <div
              className="label"
              style={{ visibility: isInstallingUninstalling ? 'hidden' : 'visible' }}
            >
              {installed ? 'Uninstall' : 'Install'}
            </div>
          </PrimaryButton>
        </div>

        <div>{name}</div>
      </Card>
      <Card>
        <ReactMarkdown rehypePlugins={[rehypeRaw]} components={CodeBlock}>
          {readme}
        </ReactMarkdown>
      </Card>
    </div>
  )
}
ExtensionInfo.displayName = 'ExtensionInfo'
export default ExtensionInfo
