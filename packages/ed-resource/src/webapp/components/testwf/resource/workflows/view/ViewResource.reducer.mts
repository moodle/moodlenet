export type CreateResourceActivity = {
  '^': {
    'check if user has creating-resource-permission': {
      'do not have': 'unauthorized view'
      'do have': 'choose content view::'
      'is anonymous': 'anonymous user view'
    }
  }
  'anonymous user view': {
    'user clicks on login button': 'end::login'
  }
  'unauthorized view': {
    'user clicks back': 'end::back to previous page'
  }
  'choose content view': {
    'user chooses a url or file as content': {
      'check if content is valid': {
        'the content is not valid': 'choose content view::show error message'
        'the content is valid': 'uploading content view'
      }
    }
  }
  'uploading content view': {
    'user cancels upload': 'choose content view::show canceled upload message'
    'upload is done': 'ai autofill metadata view'
  }
  'ai autofill metadata view': {
    'user cancels ai autofill': 'end::'
    'ai autofill is done': ['end::notify user about ai job']
  }
}
