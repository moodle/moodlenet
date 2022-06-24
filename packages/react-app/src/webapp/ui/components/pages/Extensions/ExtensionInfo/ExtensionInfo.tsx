import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { FC, ReactNode, ReactPortal, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
// import { searchNpmExtensionInfo } from '../../../../../helpers/utilities'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
import Card from '../../../atoms/Card/Card'
import TertiaryButton from '../../../atoms/TertiaryButton/TertiaryButton'
import { Package } from '../fakeData'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import rehypeRaw from 'rehype-raw'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import './styles.scss'

export type ExtensionInfoProps = {
  extension: Package
  onClickBackBtn?(arg0?: unknown): unknown | any
}

const ExtensionInfo: FC<ExtensionInfoProps> = ({ extension, onClickBackBtn }) => {
  // const stateContext = useContext(StateContext)
  const [readme, setReadme] = useState<string>('')

  useEffect(() => {
    extension.readme && extension.readme.then(response => setReadme(response))
  }, [])

  // const modulesList = extension?.modules.map(
  //   (module: Module, i) =>
  //     (!module.mandatory || stateContext?.devMode) && (
  //       <div className="module" key={i}>
  //         <div className="name">{module.name}</div>
  //         <Switch enabled={module.enabled} mandatory={module.mandatory} />
  //       </div>
  //     ),
  // )

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
    <div className="extension-info">
      <Card className="header-card">
        <div className="title">
          <div className="title-and-back">
            <TertiaryButton className="back" color="black" onClick={onClickBackBtn}>
              <ArrowBackIcon />
            </TertiaryButton>
            {extension.name}
          </div>
          <PrimaryButton className="install-btn" onClick={() => alert('installing')}>
            Install
          </PrimaryButton>
        </div>

        <div>{extension.description}</div>
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
