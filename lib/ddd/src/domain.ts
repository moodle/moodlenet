import { map } from '@moodle/lib-types'
import { event_layer, primary_layer, secondary_layer, watcher } from './types'

export type ddd<
  primary extends map<primary_layer> = map<primary_layer>,
  secondary extends map<secondary_layer> = map<secondary_layer>,
  event extends map<event_layer> = map<event_layer>,
> = {
  primary: primary
  secondary: secondary
  event: event
  watch: watcher<primary, secondary>
}


// NOTE : here's how to intersect all members of an arry of types
// type x = [{ x: { a: string } }, { x: { c: Date } }, { x: { b: number } }]

// type y<o extends any[]> = o extends [infer a, ...infer rest] ? a & y<rest> : unknown
// type k = y<x>
// declare const k: k

// k.x.b.toExponential
// k.x.a.toUpperCase
// k.x.c.getDay
