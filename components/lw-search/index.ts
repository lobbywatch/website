import type { LwSearchProps } from './component'
import { LwSearch } from './component'

declare global {
  interface HTMLElementTagNameMap {
    'lw-search': LwSearch
  }
  namespace JSX {
    interface IntrinsicElements {
      'lw-search': LwSearchProps
    }
  }
}

customElements.define('lw-search', LwSearch)
