/*
 * adapted from leny/react-use-storage
 */

import { useCallback, useEffect, useState } from 'react'

const getUseStorage = (storage: Storage) =>
  function useStorage<T>(storageKey: string) {
    const get = useCallback(() => {
      const raw = storage.getItem(storageKey)
      return raw === null ? null : (JSON.parse(raw) as T)
    }, [storageKey])
    const [value, setValue] = useState<T | null>(get)

    useEffect(() => {
      setValue(get())
    }, [get])
    const updater = useCallback(
      (value: T | null) => {
        setValue(value)
        value === null
          ? storage.removeItem(storageKey)
          : storage.setItem(storageKey, JSON.stringify(value))
      },
      [storageKey]
    )

    useEffect(() => {
      const listener = ({ storageArea, key, newValue }: StorageEvent) => {
        if (!(key === storageKey && storageArea === storage)) {
          return
        }
        setValue(newValue ? JSON.parse(newValue) : null)
      }

      window.addEventListener('storage', listener)
      return () => window.removeEventListener('storage', listener)
    }, [storageKey])

    return [value, updater] as const
  }

export const useLocalStorage = getUseStorage(localStorage)
export const useSessionStorage = getUseStorage(sessionStorage)
