import type { PkgIdentifier } from '@moodlenet/core'
import { useCallback, useEffect, useMemo, useState } from 'react'

export type PkgAddOnsHandle<AddOnType> = ReturnType<typeof usePkgAddOns<AddOnType>>
export type RegisterAddOn<AddOnType> = ReturnType<PkgAddOnsHandle<AddOnType>[1]>
export function usePkgAddOns<AddOnType>(addOnName = 'unnamed') {
  type PkgAddOnsEntry = {
    pkgId: PkgIdentifier
    addOns: PkgAddOns | null | undefined
  }
  type PkgAddOns = { [pkgAddOnName: string]: AddOnType | null | undefined }
  type PkgAddOnsEntries = { [pkgName: string]: PkgAddOnsEntry }
  type PkgAddOn = { pkgId: PkgIdentifier; name: string; addOn: AddOnType; key: string }
  const [addOnsMap, setAddOnsMap] = useState<PkgAddOnsEntries>({})

  const addOns = useMemo(reduceAddOnsToArray, [addOnsMap, addOnName])
  const getRegHook = useCallback(getRegHookFn, [])

  const pkgAddOnsHandle = useMemo(() => [addOns, getRegHook] as const, [addOns, getRegHook])

  return pkgAddOnsHandle

  function reduceAddOnsToArray() {
    return Object.values(addOnsMap).reduce<PkgAddOn[]>((outerPkgAddOnAcc, { addOns, pkgId }) => {
      const pkgAddOns = Object.entries(addOns ?? {}).reduce<PkgAddOn[]>(
        (innerPkgAddOnAcc, [pkgAddOnName, addOn]) => {
          if (!addOn) {
            return innerPkgAddOnAcc
          }
          const pkgAddOn: PkgAddOn = {
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
    }, [])
  }

  function getRegHookFn(pkgId: PkgIdentifier) {
    return useRregisterAddOn

    function useRregisterAddOn(addOns: PkgAddOns | null | undefined) {
      useEffect(() => {
        setMyAddOns(addOns)
        return () => setMyAddOns(undefined)
      }, [addOns])
    }

    function setMyAddOns(addOns: PkgAddOns | null | undefined) {
      setAddOnsMap(current => {
        return {
          ...current,
          [pkgId.name]: { pkgId, addOns },
        }
      })
    }
  }
}
