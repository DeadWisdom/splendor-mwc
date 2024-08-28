import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getMenuSize, type M3MenuItemConfig, type M3MenuSize } from '../data/menu';


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

@customElement('m3-nav')
export class M3Nav extends LitElement {
  @property({ type: String }) variant = 'auto';

  @property({ type: Array }) items?: M3MenuItemConfig[];

  @property({ type: Boolean }) example?: boolean;

  @property({ type: String, reflect: true }) size?: M3MenuSize;

  @property({ type: String, reflect: true }) limit?: M3MenuSize;

  @property({ type: Boolean, reflect: true }) open = false;

  static styles = css`
    :host {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--m3-gap, 12px);
      padding: var(--m3-gap, 12px);
      width: var(--m3-nav-width, 80px);
      background-color: var(--md-sys-color-surface);
    }

    .nav-item {
      font-family: var(--md-sys-typescale-label-medium-font-family, system-ui);
      font-size: var(--md-sys-typescale-label-medium-font-size, 10px);
      font-weight: var(--md-sys-typescale-label-medium-font-weight, 400);
      line-height: var(--md-sys-typescale-label-medium-line-height, 1);
      letter-spacing: var(--md-sys-typescale-label-medium-tracking, .5pt);
      color: var(--md-sys-color-on-surface);
      border-radius: var(--md-sys-shape-corner-none);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--m3-nav-item-gap, 2px);
      text-decoration: none;
      border: none;
      cursor: pointer;
      position: relative;
    }

    .nav-item m3-icon {
      align-self: stretch;
      height: var(--m3-nav-icon-size, 32px);
      display: flex;
    }

    .nav-item[priority="low"] { 
      display: none;
    }

    .nav-item[active], .nav-item:hover {
    }

    .nav-item .indicator {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      pointer-events: none;
      border-radius: var(--md-sys-shape-corner-full, 16px);
      z-index: -1;
    }

    .nav-item[active] .indicator, .nav-item:hover .indicator {
      background-color: var(--md-sys-color-secondary-container, #EADDFF);
    }

    .fab {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--md-sys-shape-corner-medium, 8px);
      background-color: var(--md-sys-color-primary-container, #EADDFF);
      width: var(--m3-nav-item-width, 56px);
      max-height: var(--m3-nav-item-width, 56px);
      aspect-ratio: 1;
    }

    .fab span {
      display: none;
    }

    .spacer {
      flex-shrink: 1;
      flex-grow: 1;
      max-height: 20vh;
    }

    m3-badge {
      display: none;
    }

    :host([open]) {
      width: var(--m3-drawer-width, 240px);
    }

    :host([open]) .nav-item { 
      flex-direction: row;  
      padding-left: var(--m3-gap, 12px);
    }
  `;

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

  updated(changes: Map<string, any>) {
    if (changes.has('items')) {
      this.size = getMenuSize(this.items?.filter(item => item.variant !== 'fab'));
    }
  }

  toggleMenu = () => {
    console.log("toggleMenu", this.open);
    this.open = !this.open;
  }

  render() {
    if (this.items === undefined) {
      return html`<slot></slot>`;
    }

    let fabs = this.items.filter(item => item.variant === 'fab');
    let items = this.items.filter(item => item.variant !== 'fab');

    return html`
      ${this.renderVeggieBurger()}
      ${fabs.map(item => this.renderFab(item))}
      <div class="spacer"></div>
      ${items.map(item => this.renderItem(item))}
    `;
  }

  renderVeggieBurger() {
    return html`
      <button class="nav-item menu-toggle" @click=${this.toggleMenu}>
        <m3-icon name="menu_round"></m3-icon>
      </button>
    `;
  }

  renderItem(item: M3MenuItemConfig) {
    let badge = item.badge as any;
    return html`
      <a href="${item.href}" class="nav-item" ?active=${item.active} priority=${item.priority || 'normal'}>
        <m3-icon name="${item.icon || 'default'}"></m3-icon>
        <span>${item.label}</span>
        ${badge ? html`<m3-badge variant=${badge.variant || ''}>${badge.value || badge}</m3-badge>` : ''}
      </a>
    `;
  }

  renderFab(item: M3MenuItemConfig) {
    return html`
      <a href="${item.href}" class="fab" ?active=${item.active}>
        <m3-icon name="${item.icon || 'default'}"></m3-icon>
        <span>${item.label}</span>
      </a>
    `;
  }
}