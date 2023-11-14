// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  'internalEvents': {
    '': { type: '' }
    'done.invoke.EdResource.Autogenerating-Meta:invocation[0]': {
      type: 'done.invoke.EdResource.Autogenerating-Meta:invocation[0]'
      data: unknown
      __tip: 'See the XState TS docs to learn how to strongly type this.'
    }
    'done.invoke.EdResource.In-Trash:invocation[0]': {
      type: 'done.invoke.EdResource.In-Trash:invocation[0]'
      data: unknown
      __tip: 'See the XState TS docs to learn how to strongly type this.'
    }
    'done.invoke.EdResource.Publishing-Moderation:invocation[0]': {
      type: 'done.invoke.EdResource.Publishing-Moderation:invocation[0]'
      data: unknown
      __tip: 'See the XState TS docs to learn how to strongly type this.'
    }
    'done.invoke.EdResource.Storing-Meta:invocation[0]': {
      type: 'done.invoke.EdResource.Storing-Meta:invocation[0]'
      data: unknown
      __tip: 'See the XState TS docs to learn how to strongly type this.'
    }
    'done.invoke.EdResource.Storing-New-Content:invocation[0]': {
      type: 'done.invoke.EdResource.Storing-New-Content:invocation[0]'
      data: unknown
      __tip: 'See the XState TS docs to learn how to strongly type this.'
    }
    'xstate.init': { type: 'xstate.init' }
    'xstate.stop': { type: 'xstate.stop' }
  }
  'invokeSrcNameMap': {
    MetaGenerator: 'done.invoke.EdResource.Autogenerating-Meta:invocation[0]'
    ModeratePublishingResource: 'done.invoke.EdResource.Publishing-Moderation:invocation[0]'
    ScheduleDestroy: 'done.invoke.EdResource.In-Trash:invocation[0]'
    StoreMetaEdits: 'done.invoke.EdResource.Storing-Meta:invocation[0]'
    StoreNewResource: 'done.invoke.EdResource.Storing-New-Content:invocation[0]'
  }
  'missingImplementations': {
    actions: 'destroy_all_data' | 'notify_creator' | 'validate_edit_meta_and_assign_errors'
    delays: never
    guards:
      | 'issuer has creation permission'
      | 'issuer has moderation permission'
      | 'issuer has no read permission'
      | 'issuer is creator'
      | 'issuer is creator and issuer has publishing permission and meta is formally vallid for publishing'
      | 'moderation passed'
      | 'store meta edits success'
      | 'store new resource success'
    services:
      | 'MetaGenerator'
      | 'ModeratePublishingResource'
      | 'ScheduleDestroy'
      | 'StoreMetaEdits'
      | 'StoreNewResource'
  }
  'eventsCausingActions': {
    assign_edit_meta_errors: 'done.invoke.EdResource.Storing-Meta:invocation[0]'
    assign_identifiers: 'done.invoke.EdResource.Storing-New-Content:invocation[0]'
    assign_last_publishing_moderation_rejection_reason: 'done.invoke.EdResource.Publishing-Moderation:invocation[0]'
    assign_provided_content_rejection_reason: 'done.invoke.EdResource.Storing-New-Content:invocation[0]'
    assign_suggested_meta: 'done.invoke.EdResource.Autogenerating-Meta:invocation[0]'
    assign_unauthorized: '' | 'provide-content'
    assign_updated_meta_and_image_ref: 'done.invoke.EdResource.Storing-Meta:invocation[0]'
    destroy_all_data: 'done.invoke.EdResource.In-Trash:invocation[0]'
    notify_creator:
      | ''
      | 'done.invoke.EdResource.Publishing-Moderation:invocation[0]'
      | 'xstate.stop'
    validate_edit_meta_and_assign_errors: 'edit-meta'
  }
  'eventsCausingDelays': {}
  'eventsCausingGuards': {
    'issuer has creation permission': 'provide-content'
    'issuer has moderation permission': 'reject-publish'
    'issuer has no read permission': ''
    'issuer is creator':
      | 'cancel-meta-autogen'
      | 'edit-meta'
      | 'request-meta-generation'
      | 'restore'
      | 'trash'
      | 'unpublish'
    'issuer is creator and issuer has publishing permission and meta is formally vallid for publishing': 'request-publish'
    'moderation passed': 'done.invoke.EdResource.Publishing-Moderation:invocation[0]'
    'store meta edits success': 'done.invoke.EdResource.Storing-Meta:invocation[0]'
    'store new resource success': 'done.invoke.EdResource.Storing-New-Content:invocation[0]'
  }
  'eventsCausingServices': {
    MetaGenerator:
      | 'done.invoke.EdResource.Storing-New-Content:invocation[0]'
      | 'request-meta-generation'
    ModeratePublishingResource: 'request-publish'
    ScheduleDestroy: 'trash'
    StoreMetaEdits: 'edit-meta'
    StoreNewResource: 'provide-content'
  }
  'matchesStates':
    | 'Autogenerating-Meta'
    | 'Checking-In-Content'
    | 'Destroyed'
    | 'In-Trash'
    | 'Meta-Suggestion-Available'
    | 'No-Access'
    | 'Publish-Rejected'
    | 'Published'
    | 'Publishing-Moderation'
    | 'Storing-Meta'
    | 'Storing-New-Content'
    | 'Unpublished'
  'tags': never
}
