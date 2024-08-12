import { layoutSlots } from '../misc'

export interface Layouts {
  pages: PageLayouts
  roots: RootLayouts
  components: ComponentLayouts
}

export interface RootLayouts {
  main: {
    header: {
      slots: layoutSlots<'left' | 'center' | 'right'>
    }
    footer: {
      slots: layoutSlots<'left' | 'center' | 'right' | 'bottom'>
    }
  }
  simple: {
    header: {
      slots: layoutSlots<'left' | 'center' | 'right'>
    }
    footer: {
      slots: layoutSlots<'left' | 'center' | 'right' | 'bottom'>
    }
  }
}

export interface PageLayouts {
  landing: {
    slots: layoutSlots<'head' | 'content'>
  }
  login: {
    slots: layoutSlots<'login' | 'signup'>
  }
}

export interface ComponentLayouts {
  searchbox: {
    placeholder: string
  }
}
