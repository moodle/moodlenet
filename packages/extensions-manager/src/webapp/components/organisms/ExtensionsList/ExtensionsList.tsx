// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { Card, PrimaryButton } from '@moodlenet/component-library'
import { FC } from 'react'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { DevModeBtn } from '../Extensions.js'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import { ReactComponent as ApprovedIcon } from '../../../assets/icons/approved.svg'
import { getNumberFromString, getPastelColor } from '../../../helpers/utilities.js'
import { ExtensionType } from '../../pages/InstallExtension/InstallExtension.js'
import './ExtensionsList.scss'

export type ExtensionsListProps = {
  extensions: ExtensionType[]
  title?: string
  setSelectedExt: React.Dispatch<React.SetStateAction<ExtensionType | undefined>>
}

const ExtensionsList: FC<ExtensionsListProps> = ({ extensions, title, setSelectedExt }) => {
  return (
    <Card className="extensions-list">
      <div className="subtitle">{title}</div>
      <div className="list">
        {extensions.map(extension => {
          const { displayName, description, icon, developedByMoodleNet } = extension
          const background = icon
            ? { backgroundImage: `url("${extension.icon}")`, backgroundSize: 'cover' }
            : { background: getPastelColor(getNumberFromString(displayName), 0.5) }
          return (
            <div
              className="extension"
              key={extension.displayName}
              onClick={() => {
                setSelectedExt(extension)
              }}
            >
              {/* <PackageIcon /> */}
              <div className="logo" style={background}>
                {!extension.icon && (
                  <>
                    <div className="letter">{displayName.substring(0, 1).toLocaleLowerCase()}</div>
                    <div
                      className="circle"
                      style={{ background: getPastelColor(getNumberFromString(displayName)) }}
                    />
                  </>
                )}
              </div>
              <div className="info">
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
              <PrimaryButton className="install-btn">Details</PrimaryButton>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
ExtensionsList.displayName = 'ExtensionsList'
export default ExtensionsList
