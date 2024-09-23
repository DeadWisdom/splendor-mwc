import { LitElement, html, css, render } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { queryNavItems, type M3MenuItemConfig } from '../data/menu';
import { WindowRouter, type Route } from '../controllers/m3-router';

@customElement('m3-app')
export class M3App extends LitElement {
  router = new WindowRouter(this, [
    { name: 'app', pattern: '/demo/app.html', view: (params) => html`App Demo Page` },
    { name: 'about', pattern: '/demo/app/about.html', view: (params) => html`About Page` },
    { name: 'fallback', pattern: '/demo/app/*', view: (params) => html`Fallback` }
  ]);

  @property({ type: Array })
  menu?: M3MenuItemConfig[];

  @property({ type: String, reflect: true })
  fallback?: string;

  @property({ type: Boolean, reflect: true })
  loading: boolean = false;

  connectedCallback(): void {
    if (!this.menu) {
      let navElement = this.querySelector('nav');
      if (navElement) {
        this.menu = queryNavItems(navElement);
        navElement.remove();
      }
    }
    this.querySelectorAll('*[remove-me]').forEach(el => el.remove());
    super.connectedCallback();
  }

  render() {
    console.log('render', this.router.activeRoute);
    if (this.menu) {
      return html`
        <m3-layout>
          <m3-nav slot="nav" .items=${this.menu}></m3-nav>
          <slot></slot>
        </m3-layout>
      `;
    }
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3-app": M3App;
  }
}
