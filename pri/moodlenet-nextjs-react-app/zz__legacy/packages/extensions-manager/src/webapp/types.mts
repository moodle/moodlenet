import type { DeployedPkgInfo, SearchPackagesResObject } from '../common/types.mjs'

export type NewCollectionFormValues = {
  title: string
  description: string
  visibility: 'Public' | 'Private'
  image?: string | File | null
}

export type MainContextType = {
  // defaultRegistry: string
  devMode: boolean
  setDevMode: React.Dispatch<React.SetStateAction<boolean>>
  selectedExtConfig: DeployedPkgInfo | null
  setSelectedExtConfig: React.Dispatch<React.SetStateAction<DeployedPkgInfo | null>>
  selectedExtInfo: SearchPackagesResObject | null
  setSelectedExtInfo: React.Dispatch<React.SetStateAction<SearchPackagesResObject | null>>
  // searchPkgResp: SearchPackagesResponse
}
