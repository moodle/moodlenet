import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { FC, ReactNode, ReactPortal, useCallback, useReducer } from 'react'
// import { searchNpmExtensionConfig } from '../../../../../helpers/utilities'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
import lib from 'moodlenet-react-app-lib'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
// import { StateContext } from '../ExtensionsProvider'
import { CoreExt, ExtInfo } from '@moodlenet/core'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import rehypeRaw from 'rehype-raw'
import './styles.scss'

export type ExtensionConfigProps = {
  extInfo: ExtInfo
  onClickBackBtn?(arg0?: unknown): unknown | any
}

const PrimaryButton = lib.ui.components.atoms.PrimaryButton
// const Switch = lib.ui.components.atoms.Switch
const Card = lib.ui.components.atoms.Card
const TertiaryButton = lib.ui.components.atoms.TertiaryButton

const ExtensionConfig: FC<ExtensionConfigProps> = ({ extInfo, onClickBackBtn }) => {
  // const stateContext = useContext(StateContext)

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
    lib.priHttp
      .fetch<CoreExt>(
        'moodlenet-core',
        '0.1.10',
      )('pkg/uninstall')({
        installationFolder: extInfo.packageInfo.installationFolder,
      })
      .finally(toggleIsInstalling)
  }, [extInfo.packageInfo.installationFolder])

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
        <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
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
    <div className="extension-config">
      <Card className="header-card">
        <div className="title">
          <div className="title-and-back">
            <TertiaryButton className="back" color="black" onClick={onClickBackBtn}>
              <ArrowBackIcon />
            </TertiaryButton>
            {extInfo.packageInfo.packageJson.moodlenet.displayName}
          </div>
          <PrimaryButton
            className="install-btn"
            disabled={extInfo.packageInfo.packageJson.moodlenet.displayName === 'Core'}
            onClick={uninstall}
          >
            Uninstall
          </PrimaryButton>
        </div>

        <div>{extInfo.packageInfo.packageJson.description}</div>
      </Card>
      {extInfo.packageInfo.readme && (
        <Card>
          <ReactMarkdown rehypePlugins={[rehypeRaw]} components={CodeBlock}>
            {extInfo.packageInfo.readme}
          </ReactMarkdown>
        </Card>
      )}
      {modulesList && (
        <Card className="modules">
          <div className="title">Modules</div>
          <div className="list">{modulesList}</div>
        </Card>
      )}
      {isInstalling && (
        <div style={{ position: 'fixed', top: '0', bottom: '0', left: '0', right: '0', background: 'rgba(0,0,0,0.6)' }}>
          <h1 style={{ textAlign: 'center', color: 'white' }}>Spinner !</h1>
        </div>
      )}
    </div>
  )
}
ExtensionConfig.displayName = 'ExtensionConfig'
export default ExtensionConfig
