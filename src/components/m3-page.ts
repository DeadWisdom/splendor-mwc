import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { M3MenuItemConfig } from '../data/menu';
import type { M3MediaBreakpoint } from '../data/breakpoints';


export interface M3PageConfig {
  title: string;
  description?: string;
  canonicalURI?: string;
  indexable?: boolean;
  icon?: string;
  contextMenu?: M3MenuItemConfig[];
  parentPath?: string;
  preferredWidth?: M3MediaBreakpoint;
  minWidth?: M3MediaBreakpoint;
  maxWidth?: M3MediaBreakpoint;
}

@customElement('m3-page')
export class M3Page extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html``;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    "m3-page": M3Page;
  }
}
