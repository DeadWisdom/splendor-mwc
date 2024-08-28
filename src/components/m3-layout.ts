import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('m3-layout')
export class M3Layout extends LitElement {
  static styles = css`
    :host {
      display: flex;
      height: 100vh;
      align-items: stretch;
    }

    .nav-container, .supporting-container, .main-container {
      display: flex;
      align-items: stretch;
    }
  `;

  render() {
    return html`
      <div class="nav-container">
        <slot name="nav"></slot>
      </div>
      <div class="main-container">
        <slot></slot>
      </div>
      <div class="supporting-container">
        <slot name="supporting"></slot>
      </div>
    `;
  }
}