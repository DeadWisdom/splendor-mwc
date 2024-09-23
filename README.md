# splendor-mwc
A collection of web components and techniques to create material 3 based apps

## NOTE!

This package requires either a native [`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern) implementation (which is currently only implemented in Chrome, Edge, and other Chromium browsers) or a URLPattern polyfill, like [`urlpattern-polyfill`](https://github.com/kenchris/urlpattern-polyfill).

# Theory

- Progressive enhancement is the way
- Buuut it's hard to do in a JS sort of way
- If everyting was in the light, then it wouldn't matter
- But, like, loading a huge stylesheet is just as bad
- So really, we want html-first
- With bare-bones "skeletal" css embeded into the page that makes it look okay
- Then it comes to life with JS
- Make things easy to build to customize
- That's good

# Page Router Idea

No, but the point is lean on Lit, each page can 

```
  <script>
    m3SiteNav([
      {title: 'Home', page: "index-page"},
      {title: 'Messages', src: "/message", preload: true},
    ])
  </script>
  
  <m3-app>
    <style remove-me>
      m3-app {
        display: grid;
        grid-template-rows: auto 1fr;
        height: 100vh;
        padding: 5ch;
      }
    </style>
    <nav>
      <a href="/" page="home-page" icon="home">Home</a>
      <a href="/about" src="/about" icon="info">About</a>
      <a href="/contact" src="/contact" icon="mail">Contact</a>
      <a href="/messages" page="messages-page" icon="inbox">Inbox</a>
    </nav>
    <main class="m3-pane">
      
    </main>
  </m3-app>
```

# No but let's be more high-level

Kinds of pages:
- Listing
  - List
  - Cards
  - Filters
  - Search
  - A listing is just a Collection Detail but can have a child
- Detail
  - Content
  - Editor

So actually there's just pages and some have children

Supporting Elements:
- Nav
- Aside


App has a nav
Each page can have a context menu
Pages can have children


When a page is shown

[=][ page ]
[=][ page | child ]
[=][ page | child | child ]
[=][ <- child ]

[<- child]
[= page ]

In the compact view, a top nav bar is shown with either a back for child pages or the veggie burger
for root pages.

In any larger size, the navigation is shown unless the page says differently.

M3Page {
  tagName: 'm3-page',
  layout: {
    tagName: 'm3-layout',
    showTopBar: false,
    showNavBar: false
  },
}

M3App {
  defaultLayout: 'm3-layout',
  routes: (M3Page | M3Route)[]
}

When no nav is shown, an top-bar is added and the page is given no margin.

### Concerns
Layout
Nav
Context Menu
Nav Menu Entry
Panel
Data
Loading

App
- Routing
- Nav
Page
Route

Router is Generic
Router != Nav Config

App -> Page


Router
  A router has a set of routes that dictate path -> function
  The function is called pattern params when activated, the result is given to the host
  The host can then do whatever it wants with it
  With lit, we will simply request an update on the host, and the host can then update

App
  An app has a router, a nav, and a layout
  If the route returns a template, it will replace the layout with that template
  If the route returns M3Pages, it will place those in a layout appropriately with respect to the device width
  The App will have a nav

Page
  The page will send Page events that inform the App of it's config, nav, context menu, etc.
  It is in charge of it's data and rendering