import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getMenuSize, type M3MenuItemConfig, type M3MenuSize } from '../data/menu';
import { navItemStyles } from '../style/nav-item.style';
import { largeFont } from '../style/type.style';

const exampleItems: M3MenuItemConfig[] = [
  { label: 'Inbox', icon: 'inbox_round', href: '/', badge: '124', priority: 'high' },
  { label: 'Outbox', icon: 'send_round', href: '/outbox', priority: 'high' },
  { label: 'Favorites', icon: 'favorite_round', href: '/favorites', priority: 'high' },
  { label: 'Recent', icon: 'schedule_round', href: '/recent' },
  { label: 'Trash', icon: 'delete_round', href: '/favorites' },
  { label: 'Friends', icon: 'folder_round', href: '/folders/friends', priority: 'low' },
  { label: 'Volunteering', icon: 'folder_round', href: '/folders/volunteering', priority: 'low' },
  { label: 'Work', icon: 'folder_round', href: '/folders/work', priority: 'low' },
  { label: 'New', icon: 'add_round', href: '/add', variant: 'fab' },
];

export type M3NavVariant = 'auto' | 'modal' | 'rail' | 'drawer';
export type M3NavMode = 'hidden' | 'bar' | 'rail' | 'drawer' | 'overlay';

@customElement('m3-nav')
export class M3Nav extends LitElement {
  @property({ type: String, reflect: true }) variant: M3NavVariant = 'auto';

  @property({ type: Array }) items?: M3MenuItemConfig[];

  @property({ type: Boolean }) example?: boolean;

  @property({ type: String, reflect: true }) size?: M3MenuSize;

  @property({ type: String, reflect: true }) limit?: M3MenuSize;

  @property({ type: String, reflect: true }) mode: M3NavMode = 'rail';

  @property({ type: Boolean, reflect: true }) open = false;

  static styles = [css`
    :host {
      --m3-drawer-width: 240px;
      --m3-nav-rail-width: 80px;
      --m3-nav-item-width: 56px;
      --m3-nav-icon-size: 24px;
      --m3-nav-item-padding: var(--m3-gap);
      --m3-nav-item-padding-rail: 4px;
      --m3-nav-rail-indicator-size: 30px;

      display: flex;
      flex-direction: column;
      max-width: 90vw;
      align-items: stretch;
      transition: width var(--m3-time);
      width: var(--m3-drawer-width);
    }

    .container {
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      gap: var(--m3-gap);
      padding: var(--m3-gap) 0;
      background-color: var(--md-sys-color-surface);
      z-index: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }
    
    .item-container {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 0;
      padding: 0 var(--m3-gap);
      transition: background-color, gap var(--m3-time-quick);
    }

    .button {
      align-self: flex-start;
      color: var(--md-sys-color-on-surface);
      border-radius: var(--md-sys-shape-corner-none);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--m3-item-gap, 2px);
      text-decoration: none;
      border: none;
      cursor: pointer;
      position: relative;
      z-index: 1;
      background-color: transparent;
      transition: none 150ms ease-in-out;
      padding: var(--m3-nav-button-padding, 12px);
      width: var(--m3-nav-item-width, 56px);
      justify-content: center;
      margin: 0 var(--m3-gap);
      aspect-ratio: 1;
    }
  
    .button:hover:after, .button[active]:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: var(--md-sys-color-secondary-container, #EADDFF);
      z-index: -1;
      border-radius: var(--md-sys-shape-corner-full);
    }

    .button[placement="end"] {
      align-self: flex-end;
    }

    .fab {
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--md-sys-shape-corner-large, 16px);
      background-color: var(--md-sys-color-primary-container, #EADDFF);
      max-height: var(--m3-item-width, 56px);
      gap:  var(--m3-gap);
      aspect-ratio: 1;
      text-decoration: none;
      color: var(--md-sys-color-on-primary-container, #4F378B);
      margin: 0 var(--m3-gap);
      flex-shrink: 0;
      
      ${largeFont}
    }

    .fab m3-icon {
      flex-shrink: 0;
    }
    
    .spacer {
      flex-grow: 0;
      max-height: 0;
      transition: all var(--m3-time);
    }

    /* Hidden */
    :host([mode=hidden]) {
      display: none;
      width: 0;
    }

    /* Overlay */
    :host([mode=overlay]) {
      width: 0;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 1000;
    }

    :host([mode=overlay]) .scrim {
      content: '';
      z-index: -1;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(0, 0, 0, .5);
    }
    
    :host([mode=overlay]) .container {
      gap: 0;
      background-color: var(--md-sys-color-surface-container-low);
      border-top-right-radius: var(--md-sys-shape-corner-medium);
      border-bottom-right-radius: var(--md-sys-shape-corner-medium);
      padding: var(--m3-gap) 0;
    }

    :host([open]) {
      width: var(--m3-drawer-width);
    }

    /* Rail */
    :host([mode=rail]) {
      width: var(--m3-nav-rail-width, 80px);
      transition: none;
    }
    
    :host([mode=rail]) .item-container {
      gap: var(--m3-gap);
      align-items: stretch;
    }

    :host([mode=rail]) .fab {
      aspect-ratio: 1;
    } 

    :host([mode=rail]) .fab span {
      display: none;
    }

    :host([mode=rail]) .spacer {
      flex-shrink: 1;
      flex-grow: 1; 
      max-height: 20vh;
      transition: all var(--m3-time-quick);
    }

    /* Misc */
    m3-badge {
      display: none;
    }

  `,
    navItemStyles];

  connectedCallback(): void {
    super.connectedCallback();
    if (this.example) {
      this.items = exampleItems;
    }
  }

  filterItems() {
    if (!this.items) return [];

    return this.items.filter(item => item.variant !== 'fab');
  }

  filterFabs() {
    if (!this.items) return [];

    return this.items.filter(item => item.variant === 'fab');
  }

  update(changes: Map<string, any>) {
    if (changes.has('items')) {
      this.size = getMenuSize(this.items?.filter(item => item.variant !== 'fab'));
    }
    if (changes.has('variant')) {
      this.refreshVariant();
    }
    super.update(changes);
  }

  updated(changes: Map<string, any>) {
    if (changes.has('mode')) {
      requestAnimationFrame(() => {
        this.open = (this.mode == 'overlay');
      });
    }
  }

  refreshVariant() {
    if (this.variant === 'auto') {
      this.mode = 'drawer';
    }
    else if (this.variant === 'modal') {
      this.mode = 'hidden';
    }
    else if (this.variant === 'rail') {
      this.mode = 'rail';
    }
    else if (this.variant === 'drawer' && this.mode !== 'rail') {
      this.mode = 'drawer';
    }
  }

  toggle = () => {
    if (this.mode === 'hidden' || (this.variant === 'rail' && this.mode === 'rail')) {
      this.mode = 'overlay';
    }
    else if (this.mode === 'overlay') {
      if (this.variant === 'rail') {
        this.mode = 'rail';
      } else
        this.mode = 'hidden'; {
      }
    }
    else if (this.mode === 'rail') {
      this.mode = 'drawer';
    }
    else if (this.mode === 'drawer') {
      this.mode = 'rail';
    }
  }

  render() {
    if (this.items === undefined) {
      return html`<slot></slot>`;
    }

    let fabs = this.items.filter(item => item.variant === 'fab');
    let items = this.items.filter(item => item.variant !== 'fab');

    return html`
      ${this.renderScrim()}
      <div class="container">
        ${this.renderVeggieBurger()}
        ${fabs.map(item => this.renderFab(item))}
        <div class="spacer"></div>
        <div class="item-container">
          ${items.map(item => this.renderItem(item))}
        </div>
      </div>
    `;
  }

  renderScrim() {
    if (this.mode !== 'overlay') return;
    return html`<div class="scrim" @click=${this.toggle}></div>`;
  }

  renderVeggieBurger() {
    if (this.mode === 'overlay') return;
    if (this.variant !== 'drawer' && this.variant !== 'rail') return;
    let icon = this.mode == 'drawer' ? 'menu_open_round' : 'menu_round';
    let placement = this.mode == 'drawer' ? 'end' : 'start';
    return html`
      <button class="toggle button" @click=${this.toggle} placement=${placement}>
        <m3-icon name=${icon}></m3-icon>
      </button>
    `;
  }

  renderItem(item: M3MenuItemConfig) {
    let badge = item.badge as any;
    return html`
      <a href="${item.href}" class="item" ?active=${item.active} priority=${item.priority || 'normal'}>
        <m3-icon name="${item.icon || 'default'}"></m3-icon>
        <span>${item.label}</span>
        ${badge ? html`<m3-badge variant=${badge.variant || ''}>${badge.value || badge}</m3-badge>` : ''}
      </a>
    `;
  }

  renderFab(item: M3MenuItemConfig) {
    if (this.mode === 'overlay') return;
    return html`
      <a href="${item.href}" class="fab" ?active=${item.active}>
        <m3-icon name="${item.icon || 'default'}"></m3-icon>
        <span>${item.label}</span>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3-nav": M3Nav;
  }
}
