// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { FC, ReactNode, useEffect, useState } from 'react'
import { capitalize, getNumberFromString, getPastelColor, searchNpmPackages } from '../../../../../helpers/utilities'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
import Card from '../../../atoms/Card/Card'
import InputTextField from '../../../atoms/InputTextField/InputTextField'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import ExtensionInfo from '../ExtensionInfo/ExtensionInfo'
import { Package } from '../fakeData'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import './styles.scss'

export type SearchExtensionsProps = {
  // menuItemPressed: boolean
}

const SearchExtensions: FC<SearchExtensionsProps> = () => {
  const [localPathField, setLocalPathField] = useState('')
  const [selectedPackage, setSelectedPackage] = useState<Package | undefined>(undefined)
  const [extensions, setExtensions] = useState<ReactNode | undefined>()

  useEffect(() => {
    searchNpmPackages('moodlenet').then(response => {
      setExtensions(
        response.objects.map((o: any, i: number) => {
          console.log(o)
          const id = getNumberFromString(o.package.name)
          const p: Package = {
            name: capitalize(o.package.name.replace('@moodlenet/', '')) || '',
            creator: '',
            description: capitalize(o.package.description),
            modules: [],
            logo: '',
            links: {
              homepage: o.package.links.homepage,
            },
          }
          return (
            <div className="package" key={i} /* onClick={() => setSelectedPackage(o.package.name)} */>
              {/* <PackageIcon /> */}
              <div className="left" onClick={() => setSelectedPackage(p)}>
                <div className="logo" style={{ background: getPastelColor(id, 0.5) }}>
                  <div className="letter">{p.name && p.name[0]?.toLocaleLowerCase()}</div>
                  <div className="circle" style={{ background: getPastelColor(id) }} />
                </div>
                <div className="info">
                  <div className="title">{p.name}</div>
                  <div className="details">{p.description}</div>
                </div>
              </div>
              <PrimaryButton className="install-btn">Install</PrimaryButton>
            </div>
          )
        }),
      )
    })
  }, [])

  return (
    <>
      {!selectedPackage && (
        <div className="search-extensions">
          <Card className="install">
            <div className="title">Install extension</div>

            <div className="option">
              <div className="name">Local path</div>
              <div className="actions">
                <InputTextField
                  className="local-path"
                  placeholder="Local path to package"
                  value={localPathField}
                  onChange={(t: any) => setLocalPathField(t.currentTarget.value)}
                  name="package-name"
                  edit
                  // error={shouldShowErrors && editForm.errors.displayName}
                />
                <PrimaryButton disabled={localPathField === ''}>Install</PrimaryButton>
              </div>
            </div>
          </Card>
          <Card className="available-extensions">
            <div className="title">Available extensions</div>
            <div className="list">{extensions}</div>
          </Card>
        </div>
      )}
      {selectedPackage && (
        <ExtensionInfo extension={selectedPackage} onClickBackBtn={() => setSelectedPackage(undefined)} />
      )}
    </>
  )
}
SearchExtensions.displayName = 'SearchExtensions'
export default SearchExtensions
