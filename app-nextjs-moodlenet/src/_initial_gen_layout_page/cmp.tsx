'use client'
import { useEffect, useState } from 'react'
import { _test1 } from './srv-fn-test'

export default function Cmp() {
  const [a, setA] = useState('loading...')
  useEffect(() => {
    _test1('cmp').then(setA)
  }, [])
  return <div>{a}</div>
}
