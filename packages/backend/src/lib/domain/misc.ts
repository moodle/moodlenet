export enum Acks {
  Requeue,
  Done,
  Reject,
}

// Errors

//Publish
export const PUBLISH_ERROR_TAG: unique symbol = Symbol('PUBLISH_ERROR_TAG')
export type PublishError = { [PUBLISH_ERROR_TAG]: any }
export const publishError = (err: any): PublishError => ({
  [PUBLISH_ERROR_TAG]: err,
})
export const isPublishError = (_: any): _ is PublishError => !!_ && PUBLISH_ERROR_TAG in _
export const getPublishError = (_: PublishError) => _[PUBLISH_ERROR_TAG]
