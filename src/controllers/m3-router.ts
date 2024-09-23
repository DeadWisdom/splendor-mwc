import { type ReactiveController, type ReactiveControllerHost } from 'lit';

export type RouterCallback = (route?: BoundRoute) => void;

export interface Route {
  name?: string;
  pattern: string | URLPattern;
  view: (params: { [key: string]: string | undefined }) => any;
}

export interface BoundRoute extends Route {
  url: URL;
  params: { [key: string]: string | undefined };
}

export interface RouterOptions {
  baseURL?: string | URL;
  callback?: RouterCallback;
}

export class Router implements ReactiveController {
  _host: ReactiveControllerHost & HTMLElement;

  _active?: BoundRoute;

  routes: Array<Route> = [];
  baseURL?: string | URL;
  callback?: RouterCallback;

  get activeRoute() {
    return this._active;
  }

  constructor(
    host: ReactiveControllerHost & HTMLElement,
    routes: Array<Route>,
    options?: RouterOptions
  ) {
    (this._host = host).addController(this);
    this.routes = routes;
    this.baseURL = options?.baseURL || window.location.origin;
    this.callback = options?.callback;
  }

  hostConnected(): void { }

  view() {
    if (this._active) {
      return this._active.view(this._active.params);
    }
  }

  findRoute(url: string | URL, baseURL?: string | URL): BoundRoute | undefined {
    url = new URL(url, baseURL || this.activeRoute?.url || this.baseURL);
    let params: { [key: string]: string | undefined };
    for (let route of this.routes) {
      let pattern = getPattern(route.pattern);
      let match = pattern.exec(url);
      if (match) {
        params = getParams(match, pattern);
        params._url = url.href;
        return {
          url,
          params,
          name: route.name,
          view: route.view,
          pattern: route.pattern
        };
      }
    }
  }

  hasRoute(url: string | URL): boolean {
    return !!this.findRoute(url);
  }

  activate(boundRoute: BoundRoute) {
    this._active = boundRoute;
    if (this.callback) {
      this.callback(boundRoute);
    } else {
      this._host.requestUpdate();
    }
  }

  activateByURL(url: string | URL, baseURL?: string | URL) {
    let route = this.findRoute(url, baseURL);
    if (!route) return undefined;
    this.activate(route);
    return route;
  }
}

export class WindowRouter extends Router {
  hostConnected(): void {
    super.hostConnected();
    //this.baseURL = this.baseURL || window.location.origin;
    window.addEventListener('popstate', this._onPopState);
    window.addEventListener('click', this._onClick);
    this.activateByURL(window.location.href);
  }

  _onPopState = (_e: PopStateEvent) => {
    this.activateByURL(window.location.href);
  }

  navigate(url: string, state?: any) {
    let route = this.activateByURL(url);
    if (route) {
      window.history.pushState(state, '', route.url);
    } else {
      throw new Error(`No route found for ${url}`);
    }
  }

  replace(url: string, state?: any) {
    let route = this.activateByURL(url);
    if (route) {
      window.history.replaceState(state, '', route.url);
    } else {
      throw new Error(`No route found for ${url}`);
    }
  }

  reload() {
    if (this._active) {
      this.activate(this._active);
    }
  }

  _onClick = (e: MouseEvent) => {
    const isNonNavigationClick = e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey;
    if (e.defaultPrevented || isNonNavigationClick) return;

    const composedPath = e.composedPath() as HTMLElement[];
    const anchor = composedPath.find((el) => el.hasAttribute && el.hasAttribute('href'));

    if (!anchor || anchor.getAttribute('target')) return;

    const href = anchor.getAttribute('href');
    if (!href || href === location.href) return;

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;

    if (this.activateByURL(url)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
}


export interface URLPatternInit {
  baseURL?: string;
  username?: string;
  password?: string;
  protocol?: string;
  hostname?: string;
  port?: string;
  pathname?: string;
  search?: string;
  hash?: string;
}

const patternCache = new Map();
const getPattern = (input: string | URLPattern | Record<string, string>) => {
  if (input instanceof URLPattern) {
    return input;
  }
  let pattern = patternCache.get(input);
  if (pattern === undefined) {
    if (typeof input === 'string' && !input.match(/^[a-z]+:\/\//)) {
      pattern = new URLPattern({ pathname: input });
    } else {
      pattern = new URLPattern(input);
    }
    patternCache.set(input, pattern);
  }
  return pattern;
};

const getParams = (patternMatch: any, pattern: URLPattern) => {
  let params: Record<string, any> = {};
  let index = 0;
  for (let urlPart of Object.keys(patternMatch)) {
    if (urlPart === 'inputs') continue;
    let groups = patternMatch[urlPart].groups || {};
    let keys = Object.keys(groups);

    keys.sort();
    keys.forEach(key => {
      if (urlPart !== 'pathname' && key === '0') return;
      if (/\d+/.test(key)) {
        params[index++] = groups[key];
      } else {
        params[key] = groups[key];
      }
    });
  }
  if (patternMatch)
    params._match = patternMatch;
  return params;
}