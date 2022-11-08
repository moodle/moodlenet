import { Card, Loading, PrimaryButton, TertiaryButton } from '@moodlenet/component-library'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { FC, ReactNode, ReactPortal, useCallback, useContext, useReducer } from 'react'
// import { searchNpmExtensionConfig } from '../../../../../helpers/utilities'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
// import { StateContext } from '../ExtensionsProvider'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
// import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus'
// import vscDarkPlus from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus'
// import vscDarkPlus from 'react-syntax-highlighter'
import rehypeRaw from 'rehype-raw'
import { extNameDescription } from '../../common/lib.mjs'
import { DeployedPkgInfo } from '../../types.mjs'
import { mandatoryPackages } from '../fakeData.js'
import { MainContext } from '../MainContext.js'
import './ExtensionConfig.scss'

export type ExtensionConfigProps = {
  pkgInfo: DeployedPkgInfo
  onClickBackBtn?(arg0?: unknown): unknown | any
}

const ExtensionConfig: FC<ExtensionConfigProps> = ({ pkgInfo, onClickBackBtn }) => {
  const { pkgs } = useContext(MainContext)
  const [myPkg] = pkgs

  const modulesList = null /* extension?.modules.map(
    (module: Module, i) =>
      (!module.mandatory || stateContext.devMode) && (
        <div className="module" key={i}>
          <div className="name">{module.name}</div>
          <Switch enabled={module.enabled} mandatory={module.mandatory} />
        </div>
      ),
  ) */
  const [isInstalling, toggleIsInstalling] = useReducer((p: boolean) => !p, false)
  const uninstall = useCallback(() => {
    toggleIsInstalling()

    myPkg.call('uninstall')([pkgInfo.pkgId])
    // .finally(toggleIsInstalling)
  }, [myPkg, pkgInfo.pkgId])

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
  const { /* description, */ displayName } = extNameDescription(pkgInfo.packageJson)
  return (
    <div className="extension-config">
      <Card className="header-card">
        <div className="title">
          <div className="title-and-back">
            <TertiaryButton className="back" color="black" onClick={onClickBackBtn}>
              <ArrowBackIcon />
            </TertiaryButton>
            {displayName}
          </div>
          <PrimaryButton
            className={`install-btn ${isInstalling ? 'loading' : ''}`}
            disabled={mandatoryPackages.includes(pkgInfo.packageJson.name)}
            onClick={uninstall}
            noHover={isInstalling}
          >
            <div className="loading" style={{ visibility: isInstalling ? 'visible' : 'hidden' }}>
              <Loading color="white" />
            </div>
            <div className="label" style={{ visibility: isInstalling ? 'hidden' : 'visible' }}>
              Uninstall
            </div>
          </PrimaryButton>
        </div>

        <div>{pkgInfo.packageJson.description}</div>
      </Card>
      {pkgInfo.readme && (
        <Card>
          <ReactMarkdown rehypePlugins={[rehypeRaw]} components={CodeBlock}>
            {pkgInfo.readme}
          </ReactMarkdown>
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
