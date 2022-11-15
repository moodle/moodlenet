import { Card, Loading, PrimaryButton, TertiaryButton } from '@moodlenet/component-library'
import { ArrowBackIosNew } from '@mui/icons-material'
import { FC, ReactNode, ReactPortal } from 'react'
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
import { getNumberFromString, getPastelColor } from '../../../helpers/utilities.js'
import { ExtensionType } from '../InstallExtension/InstallExtension.js'
import './ExtensionInfo.scss'

export type ExtensionInfoProps = {
  onClickBackBtn?: (arg0?: unknown) => unknown
  extension: ExtensionType
}

const ExtensionInfo: FC<ExtensionInfoProps> = ({ extension, onClickBackBtn }) => {
  const {
    description,
    icon,
    repositoryUrl,
    installed,
    displayName,
    readme,
    isInstallingUninstalling,
    toggleInstallingUninstalling,
  } = extension

  // const [isInstallingUninstalling, toggleInstallingUninstalling] = useState(false)
  // const [installed, setInstalled] = useState(false)

  // useEffect(() => {
  //   isInstallingUninstalling &&
  //     setTimeout(() => {
  //       setInstalled(!installed)
  //       toggleInstallingUninstalling(!isInstallingUninstalling)
  //     }, 1000)
  // }, [isInstallingUninstalling, installed])
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
  // //         <div className="displayName">{module.displayName}</div>
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

  const background = icon
    ? { backgroundImage: `url("${icon}")`, backgroundSize: 'cover' }
    : { background: getPastelColor(getNumberFromString(displayName), 0.5) }

  return (
    <div className="extension-info">
      <TertiaryButton className="back" color="black" onClick={onClickBackBtn}>
        <ArrowBackIosNew /> Back
      </TertiaryButton>
      <Card className="header-card">
        <div className="header-left">
          <div className="logo" style={background}>
            {!icon && (
              <>
                <div className="letter">{displayName.substring(0, 1).toLocaleLowerCase()}</div>
                <div
                  className="circle"
                  style={{ background: getPastelColor(getNumberFromString(displayName)) }}
                />
              </>
            )}
          </div>
        </div>
        <div className="header-right">
          <div className="top-header">
            <div className="title">{displayName}</div>
            <PrimaryButton
              className={`install-btn ${isInstallingUninstalling ? 'loading' : ''}`}
              noHover={isInstallingUninstalling}
              disabled={mandatoryPackages.includes(displayName)}
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
          <div className="description">{description}</div>
        </div>
      </Card>
      <Card className="readme-card">
        <div className="readme-header">
          <div className="readme-type">README</div>
          <a className="repository-link" href={repositoryUrl} target="_blank" rel="noreferrer">
            View repository
          </a>
        </div>
        <div className="readme-content">
          <ReactMarkdown rehypePlugins={[rehypeRaw]} components={CodeBlock}>
            {readme}
          </ReactMarkdown>
        </div>
      </Card>
    </div>
  )
}
ExtensionInfo.displayName = 'ExtensionInfo'
export default ExtensionInfo
