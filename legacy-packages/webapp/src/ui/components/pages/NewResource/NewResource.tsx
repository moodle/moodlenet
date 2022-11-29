import { t, Trans } from '@lingui/macro'
import { Dispatch, Reducer, useMemo, useReducer } from 'react'
import { createCtx } from '../../../../lib/context'
import { CP, withCtrl } from '../../../lib/ctrl'
import { FormikHandle } from '../../../lib/formik'
import ProgressState from '../../atoms/ProgressState/ProgressState'
import Snackbar from '../../atoms/Snackbar/Snackbar'
import {
  HeaderPageTemplate,
  HeaderPageTemplateProps,
} from '../../templates/HeaderPageTemplate'
import {
  AddToCollections,
  AddToCollectionsProps,
} from './AddToCollections/AddToCollections'
import { ExtraDetails, ExtraDetailsProps } from './ExtraDetails/ExtraDetails'
import './styles.scss'
import { NewResourceFormValues } from './types'
import {
  UploadResource,
  UploadResourceProps,
} from './UploadResource/UploadResource'

const progressTitles = [
  t`Upload resource`,
  t`Add to collections`,
  t`Add details`,
]
const progressSubtitles = [
  `Please, publish only open educational content on MoodleNet`,
  ``,
  ``,
]

export type NewResourceProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  form: FormikHandle<NewResourceFormValues>
  uploadResourceProps: CP<UploadResourceProps>
  addToCollectionsProps: CP<AddToCollectionsProps>
  extraDetailsProps: CP<ExtraDetailsProps>
  _initialProgressIndex?: number
}

type Ctx = {
  dispatch: Dispatch<Action>
  form: FormikHandle<NewResourceFormValues>
  nextForm(): unknown
  prevForm(): unknown
}
export const [useNewResourcePageCtx, NewResourcePageCtxProvider] =
  createCtx<Ctx>('NewResourcePageCtx')

type PageState = { progressIndex: number }
type Action = [act: 'progress', back?: boolean]
const reducer: Reducer<PageState, Action> = (prev, act) => {
  switch (act[0]) {
    case 'progress': {
      const d = act[1] ? -1 : 1
      const progressIndex = Math.max(Math.min(prev.progressIndex + d, 2), 0)
      return {
        ...prev,
        progressIndex,
      }
    }
    default:
      return prev
  }
}
export const NewResource = withCtrl<NewResourceProps>(
  ({
    addToCollectionsProps,
    extraDetailsProps,
    uploadResourceProps,
    headerPageTemplateProps,
    form,
    _initialProgressIndex = 0,
  }) => {
    const [pageState, dispatch] = useReducer(reducer, {
      progressIndex: _initialProgressIndex,
    })

    const content = [
      <UploadResource {...uploadResourceProps} />,
      <AddToCollections {...addToCollectionsProps} />,
      <ExtraDetails {...extraDetailsProps} />,
    ][pageState.progressIndex]

    const ctx = useMemo<Ctx>(
      () => ({
        dispatch,
        form,
        nextForm: () => dispatch(['progress']),
        prevForm: () => dispatch(['progress', true]),
      }),
      [form]
    )

    return (
      <NewResourcePageCtxProvider value={ctx}>
        {form.values.content instanceof Blob && form.errors.content && (
          <Snackbar
            position="bottom"
            type="error"
            autoHideDuration={6000}
            showCloseButton={false}
          >
            {form.errors.content}
          </Snackbar>
        )}
        {form.isSubmitting && (
          <Snackbar
            position="bottom"
            type="info"
            waitDuration={2000}
            autoHideDuration={6000}
            showCloseButton={false}
          >
            <Trans>Content uploading, please don't close the tab</Trans>
          </Snackbar>
        )}
        <HeaderPageTemplate {...headerPageTemplateProps}>
          <div className="new-resource">
            <ProgressState
              stateNames={progressTitles}
              currentIndex={pageState.progressIndex}
              progressSubtitles={progressSubtitles}
            />
            <div className="content">{content}</div>
          </div>
        </HeaderPageTemplate>
      </NewResourcePageCtxProvider>
    )
  }
)
NewResource.displayName = 'NewResourcePage'
