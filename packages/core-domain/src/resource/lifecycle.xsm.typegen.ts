// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  'internalEvents': {
    '': { type: '' }
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
    'done.invoke.EdResource.Storing-Edits:invocation[0]': {
      type: 'done.invoke.EdResource.Storing-Edits:invocation[0]'
      data: unknown
      __tip: 'See the XState TS docs to learn how to strongly type this.'
    }
    'done.invoke.EdResource.Storing-New-Resource:invocation[0]': {
      type: 'done.invoke.EdResource.Storing-New-Resource:invocation[0]'
      data: unknown
      __tip: 'See the XState TS docs to learn how to strongly type this.'
    }
    'xstate.init': { type: 'xstate.init' }
    'xstate.stop': { type: 'xstate.stop' }
  }
  'invokeSrcNameMap': {
    ModeratePublishingResource: 'done.invoke.EdResource.Publishing-Moderation:invocation[0]'
    ScheduleDestroy: 'done.invoke.EdResource.In-Trash:invocation[0]'
    StoreNewResource: 'done.invoke.EdResource.Storing-New-Resource:invocation[0]'
    StoreResourceEdits: 'done.invoke.EdResource.Storing-Edits:invocation[0]'
  }
  'missingImplementations': {
    actions:
      | 'assign_doc'
      | 'assign_last_publishing_moderation_rejection_reason'
      | 'assign_provided_content_validations'
      | 'assign_resource_edits'
      | 'assign_suggested_meta'
      | 'assign_unauthorized'
      | 'assign_validations'
      | 'destroy_all_data'
      | 'notify_creator'
      | 'request_generate_meta_suggestions'
    delays: never
    guards:
      | 'issuer has no read permission'
      | 'issuer is admin'
      | 'issuer is creator'
      | 'issuer is creator and edits are valid'
      | 'issuer is creator and issuer is publisher and meta valid for publishing'
      | 'issuer is creator and meta generator enabled'
      | 'issuer is not an authenticated user'
      | 'issuer is system'
      | 'meta generator enabled'
      | 'moderation passed'
      | 'provided content+meta are not valid'
    services:
      | 'ModeratePublishingResource'
      | 'ScheduleDestroy'
      | 'StoreNewResource'
      | 'StoreResourceEdits'
  }
  'eventsCausingActions': {
    assign_doc:
      | 'done.invoke.EdResource.Storing-Edits:invocation[0]'
      | 'done.invoke.EdResource.Storing-New-Resource:invocation[0]'
    assign_last_publishing_moderation_rejection_reason: 'done.invoke.EdResource.Publishing-Moderation:invocation[0]'
    assign_provided_content_validations: 'provide-new-resource'
    assign_resource_edits: 'provide-resource-edits'
    assign_suggested_meta: 'generated-meta-suggestions'
    assign_unauthorized: '' | 'provide-new-resource'
    assign_validations:
      | 'cancel-meta-generation'
      | 'done.invoke.EdResource.Storing-Edits:invocation[0]'
      | 'done.invoke.EdResource.Storing-New-Resource:invocation[0]'
      | 'provide-resource-edits'
      | 'restore'
      | 'unpublish'
    destroy_all_data: 'done.invoke.EdResource.In-Trash:invocation[0]'
    notify_creator:
      | ''
      | 'done.invoke.EdResource.Publishing-Moderation:invocation[0]'
      | 'xstate.stop'
    request_generate_meta_suggestions:
      | 'done.invoke.EdResource.Storing-New-Resource:invocation[0]'
      | 'request-meta-generation'
  }
  'eventsCausingDelays': {}
  'eventsCausingGuards': {
    'issuer has no read permission': ''
    'issuer is admin': 'reject-publish'
    'issuer is creator':
      | 'cancel-meta-generation'
      | 'provide-resource-edits'
      | 'restore'
      | 'trash'
      | 'unpublish'
    'issuer is creator and edits are valid': 'store-edits'
    'issuer is creator and issuer is publisher and meta valid for publishing': 'request-publish'
    'issuer is creator and meta generator enabled': 'request-meta-generation'
    'issuer is not an authenticated user': 'provide-new-resource'
    'issuer is system': 'generated-meta-suggestions'
    'meta generator enabled': 'done.invoke.EdResource.Storing-New-Resource:invocation[0]'
    'moderation passed': 'done.invoke.EdResource.Publishing-Moderation:invocation[0]'
    'provided content+meta are not valid': 'store-new-resource'
  }
  'eventsCausingServices': {
    ModeratePublishingResource: 'request-publish'
    ScheduleDestroy: 'trash'
    StoreNewResource: 'store-new-resource'
    StoreResourceEdits: 'store-edits'
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
    | 'Storing-Edits'
    | 'Storing-New-Resource'
    | 'Unpublished'
  'tags': never
}