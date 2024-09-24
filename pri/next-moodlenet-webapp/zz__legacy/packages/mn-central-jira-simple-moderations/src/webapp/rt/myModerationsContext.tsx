import { silentCatchAbort } from '@moodlenet/react-app/webapp'
import { useMyProfileContext } from '@moodlenet/web-user/webapp'
import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useMemo, useState } from 'react'
import type { RpcApprovalRequestState } from '../../common/types.mjs'
import { shell } from './shell.mjs'

export type JiraApprovalContext = {
  state:
    | RpcApprovalRequestState
    | { type: 'wait' }
    | { type: 'is-publisher' }
    | { type: 'anonymous' }
  requestApproval(): void
  refresh(): void
}
export type MyModerationsContextT = { approval: JiraApprovalContext }

export const MyModerationsContext = createContext<MyModerationsContextT>(null as any)

export function MyModerationsContextProvider({ children }: PropsWithChildren<unknown>) {
  const approval = useJiraApprovalContextValue()
  const ctx = useMemo<MyModerationsContextT>(() => ({ approval }), [approval])
  return <MyModerationsContext.Provider value={ctx}>{children}</MyModerationsContext.Provider>
}

function useJiraApprovalContextValue() {
  const [rpcApprovalRequestState, setRpcApprovalRequestState] =
    useState<JiraApprovalContext['state']>()

  const profileCtx = useMyProfileContext()

  const refresh = useCallback<JiraApprovalContext['refresh']>(() => {
    if (profileCtx?.myProfile.publisher) {
      return
    }
    shell.rpc
      .me('webapp/user-approval/get-my-status', { rpcId: 'user-approval/get-my-status' })()
      .then(setRpcApprovalRequestState)
      .catch(silentCatchAbort)
  }, [profileCtx?.myProfile.publisher])

  const requestApproval = useCallback<JiraApprovalContext['requestApproval']>(() => {
    shell.rpc.me('webapp/user-approval/request-approval')().then(setRpcApprovalRequestState)
  }, [])
  const rpcApprovalCtxVal = useMemo<JiraApprovalContext>(() => {
    const jiraApprovalContext: JiraApprovalContext = {
      refresh,
      requestApproval,
      state: !rpcApprovalRequestState
        ? { type: 'wait' }
        : !profileCtx
          ? { type: 'anonymous' }
          : profileCtx.myProfile.publisher
            ? { type: 'is-publisher' }
            : rpcApprovalRequestState,
    }
    return jiraApprovalContext
  }, [profileCtx, requestApproval, rpcApprovalRequestState, refresh])

  return rpcApprovalCtxVal
}
