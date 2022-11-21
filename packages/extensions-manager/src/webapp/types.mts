import { ReactAppMainComponentProps } from '@moodlenet/react-app/web-lib'
import type myConn from '../main.mjs'
import { DeployedPkgInfo, SearchPackagesResObject, SearchPackagesResponse } from '../main.mjs'

export type NewCollectionFormValues = {
  title: string
  description: string
  visibility: 'Public' | 'Private'
  image?: string | File | null
}

export type WebPkgDeps = [typeof myConn]

export type MainContextType = ReactAppMainComponentProps<WebPkgDeps> & {
  defaultRegistry: string
  devMode: boolean
  setDevMode: React.Dispatch<React.SetStateAction<boolean>>
  selectedExtConfig: DeployedPkgInfo | null
  setSelectedExtConfig: React.Dispatch<React.SetStateAction<DeployedPkgInfo | null>>
  selectedExtInfo: SearchPackagesResObject | null
  setSelectedExtInfo: React.Dispatch<React.SetStateAction<SearchPackagesResObject | null>>
  searchPkgResp: SearchPackagesResponse
}
