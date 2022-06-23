import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { FC, ReactNode, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { getReadmeFromRepo } from '../../../../../helpers/utilities'
// import { searchNpmExtensionInfo } from '../../../../../helpers/utilities'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
import Card from '../../../atoms/Card/Card'
import TertiaryButton from '../../../atoms/TertiaryButton/TertiaryButton'
import { Package } from '../fakeData'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import './styles.scss'

export type ExtensionInfoProps = {
  extension: Package
  onClickBackBtn?(arg0?: unknown): unknown | any
}

const ExtensionInfo: FC<ExtensionInfoProps> = ({ extension, onClickBackBtn }) => {
  // const stateContext = useContext(StateContext)
  const [readme, setReadme] = useState<ReactNode | undefined>()

  useEffect(() => {
    getReadmeFromRepo((extension.links && extension.links.homepage) ?? '').then(response => setReadme(response))
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

  const testmd = `
    # MoodleNet CE Platform 
          
    ## System Requirements

    ### NodeJs However, if you experience issues on installation or
    on upload functionalities, you may want to [check out sharp system
    requisites](https://github.com/lovell/sharp/tree/master/docs) 
    
    ### A running ArangoDB instance the easiest way
    is using docker:
  `

  return (
    <div className="extension-config">
      <Card className="header">
        <div className="title">
          <TertiaryButton className="back" color="black" onClick={onClickBackBtn}>
            <ArrowBackIcon />
          </TertiaryButton>
          {extension.name}
        </div>
        <div>{extension.description}</div>
      </Card>
      <Card>
        <ReactMarkdown children={testmd} />
        {readme}
      </Card>
      {/* <Card className="modules">
        <div className="title">Modules</div>
        <div className="list">{modulesList}</div>
      </Card> */}
    </div>
  )
}
ExtensionInfo.displayName = 'ExtensionInfo'
export default ExtensionInfo
