import type { PkgIdentifier } from '@moodlenet/core'
import { useCallback, useEffect, useMemo, useState } from 'react'

export type UsePkgAddOns<AddOnType> = typeof usePkgAddOns<AddOnType>
export type PkgAddOnsHandle<AddOnType> = ReturnType<UsePkgAddOns<AddOnType>>
export type UseRegisterAddOn<AddOnType> = ReturnType<PkgAddOnsHandle<AddOnType>[1]>
export type PkgAddOnsEntry<AddOnType> = {
  pkgId: PkgIdentifier
  addOns: PkgAddOns<AddOnType> | null | undefined
}
export type PkgAddOns<AddOnType> = { [pkgAddOnName: string]: AddOnType | null | undefined }
type PkgAddOnsEntries<AddOnType> = { [pkgName: string]: PkgAddOnsEntry<AddOnType> }
export type PkgAddOn<AddOnType> = {
  pkgId: PkgIdentifier
  name: string
  addOn: AddOnType
  key: string
}

export function usePkgAddOns<AddOnType>(addOnName = 'unnamed') {
  const [addOnsMap, setAddOnsMap] = useState<PkgAddOnsEntries<AddOnType>>({})

  const addOns = useMemo(reduceAddOnsToArray, [addOnsMap, addOnName])
  const getRegHook = useCallback(getRegHookFn, [])

  const pkgAddOnsHandle = useMemo(() => [addOns, getRegHook] as const, [addOns, getRegHook])

  return pkgAddOnsHandle

  function reduceAddOnsToArray() {
    return Object.values(addOnsMap).reduce<PkgAddOn<AddOnType>[]>(
      (outerPkgAddOnAcc, { addOns, pkgId }) => {
        const pkgAddOns = Object.entries(addOns ?? {}).reduce<PkgAddOn<AddOnType>[]>(
          (innerPkgAddOnAcc, [pkgAddOnName, addOn]) => {
            if (!addOn) {
              return innerPkgAddOnAcc
            }
            const pkgAddOn: PkgAddOn<AddOnType> = {
              addOn,
              name: pkgAddOnName,
              pkgId,
              key: `${addOnName}-addOn::${pkgId.name}#${pkgAddOnName}`,
            }
            return [...innerPkgAddOnAcc, pkgAddOn]
          },
          [],
        )
        return [...outerPkgAddOnAcc, ...pkgAddOns]
      },
      [],
    )
  }

  function getRegHookFn(pkgId: PkgIdentifier) {
    return useRegisterAddOn

    function useRegisterAddOn(addOns: PkgAddOns<AddOnType> | null | undefined) {
      useEffect(() => {
        setMyAddOns(addOns)
        return () => setMyAddOns(undefined)
      }, [addOns])
    }

    function setMyAddOns(addOns: PkgAddOns<AddOnType> | null | undefined) {
      setAddOnsMap(current => {
        return {
          ...current,
          [pkgId.name]: { pkgId, addOns },
        }
      })
    }
  }
}
