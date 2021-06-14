import { FormikConfig, useFormik } from 'formik'
import { useMemo } from 'react'
import { FormBag } from '../ui/types'
import { hasNoValue } from './data'

export const useFormikWithBag = <Values>(cfg: FormikConfig<Values>) => {
  const formik = useFormik<Values>(cfg)
  const bag = useMemo<FormBag<Values>>(() => {
    return {
      ...formik,
      inputAttrs: Object.entries(formik.values).reduce<FormBag<Values>['inputAttrs']>((collect, [name, value]) => {
        return {
          ...collect,
          [name]: {
            name,
            ...(value instanceof File || hasNoValue(value)
              ? null
              : {
                  value,
                }),
          },
        }
      }, {} as any),
    }
  }, [formik])

  return [formik, bag] as const
}
