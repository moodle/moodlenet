import {
  Card,
  Loading,
  PrimaryButton,
  SecondaryButton,
  Snackbar,
  TertiaryButton,
} from '@moodlenet/component-library'
import { ArrowBackIosNew } from '@mui/icons-material'
import { FC, ReactNode, ReactPortal } from 'react'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { ReactComponent as ApprovedIcon } from '../../../assets/icons/approved.svg'
// import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus'
// import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
// import { searchNpmExtensionInfo } from '../../../../../helpers/utilities'
// import { withCtrl } from '../../../../lib/ctrl'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
// import { CoreExt } from '@moodlenet/core'
import rehypeRaw from 'rehype-raw'
import { getNumberFromString, getPastelColor } from '../../../helpers/utilities.js'
import { ExtensionType } from '../InstallExtension/InstallExtension.js'
import './ExtensionInfo.scss'

export type ExtensionInfoProps = {
  onClickBackBtn?: (arg0?: unknown) => unknown
  extension: ExtensionType
  children?: ReactNode
}

const ExtensionInfo: FC<ExtensionInfoProps> = ({ extension, children, onClickBackBtn }) => {
  const {
    description,
    icon,
    repositoryUrl,
    mandatory,
    displayName,
    readme,
    installed,
    isInstallingUninstalling,
    developedByMoodleNet,
    installUninstallSucces,
    toggleInstallingUninstalling,
  } = extension

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

  // const [isInstallingUninstalling, setIsInstallingUninstalling] = useState(false)
  // const [installUninstallSucces, setInstallUninstallSucces] = useState(false)
  // const [installed, setInstalled] = useState(false)

  // const toggleInstallingUninstalling = () => {
  //   setIsInstallingUninstalling(true)
  // }

  // useEffect(() => {
  //   isInstallingUninstalling &&
  //     setTimeout(() => {
  //       setIsInstallingUninstalling(false)
  //       setInstallUninstallSucces(true)
  //       setInstalled(!installed)
  //       setTimeout(() => {
  //         setInstallUninstallSucces(false)
  //       }, 4000)
  //     }, 4000)
  // }, [isInstallingUninstalling, installed])

  return (
    <div className="extension-info">
      {installUninstallSucces && (
        <Snackbar type="success" autoHideDuration={4000}>
          {installed ? 'Extension installed' : 'Extension uninstalled'}
        </Snackbar>
      )}
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
        <div className="header-center">
          <div className="top">
            <div className="title">{displayName}</div>
            {developedByMoodleNet && (
              <abbr
                className={`approved-icon`}
                title={`This extensions is mantained and recommended by the MoodleNet team`}
              >
                <ApprovedIcon />
              </abbr>
            )}
          </div>
          <div className="details">{description}</div>
        </div>
        <div className="header-right">
          {installed ? (
            <SecondaryButton
              className={`install-uninstall-btn ${isInstallingUninstalling ? 'loading' : ''}`}
              noHover={isInstallingUninstalling}
              color="grey"
              disabled={mandatory}
              onClick={toggleInstallingUninstalling}
            >
              <div
                className="loading"
                style={{ visibility: isInstallingUninstalling ? 'visible' : 'hidden' }}
              >
                <Loading color="#727588" />
              </div>
              <div
                className="label"
                style={{ visibility: isInstallingUninstalling ? 'hidden' : 'visible' }}
              >
                Uninstall
              </div>
            </SecondaryButton>
          ) : (
            <PrimaryButton
              className={`install-uninstall-btn ${isInstallingUninstalling ? 'loading' : ''}`}
              noHover={isInstallingUninstalling}
              disabled={mandatory}
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
                Install
              </div>
            </PrimaryButton>
          )}
        </div>
      </Card>
      {children}
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
