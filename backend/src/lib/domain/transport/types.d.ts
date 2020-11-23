import { Route } from '../types'

export type Path =
  | [dom: string, srv: string, sect: 'api', apiName: string]
  | [dom: string, srv: string, sect: 'ev', evName: string]
  | [dom: string, srv: string, sect: 'wf', wfName: string, id: string, stage: 'start']
  | [
      dom: string,
      srv: string,
      sect: 'wf',
      wfName: string,
      id: string,
      stage: 'progress' | 'signal' | 'end',
      stageName: string
    ]
