---
id: lifecycle-apis
title: Lifecycle APIs
---

> :warning: _This section is a work in progress._

Lifecycle APIs are shared by Themes and Plugins.

## getPathsToWatch()

Specifies the paths to watch for plugins and themes. The paths are watched by the dev server so that the plugin lifecycles are reloaded when contents in the watched paths change. Note that the plugins and themes modules are initially called with `context` and `options` from Node, which you may use to find the necessary directory information about the site.

```js
const contentPath = path.resolve(context.siteDir, options.path);

getPathsToWatch() {
  const {include = []} = options;
  const globPattern = include.map(pattern => `${contentPath}/${pattern}`);
  return [...globPattern];
}
```

## async loadContent()

Plugins should use this lifecycle to fetch from data sources (filesystem, remote API, headless CMS, etc).

## async contentLoaded({content, actions})

Plugins should use the data loaded in `loadContent` and construct the pages/routes that consume the loaded data.

### `content`

`contentLoaded` will be called _after_ `loadContent` is done, the return value of `loadContent()` will be passed to `contentLoaded` as `content`.

### `actions`

`actions` contain two functions:

- `addRoute(config: RouteConfig): void`
- `createData(name: string, data: Object): Promise<string>`

where `RouteConfig` is an object with the necessary data to configure a route to add to the website:

```js
interface RouteConfig {
  path: string;
  component: string;
  modules?: RouteModule;
  routes?: RouteConfig[];
  exact?: boolean;
}

interface RouteModule {
  [module: string]: Module | RouteModule | RouteModule[];
}
```

Example `addRoute` call:

```js
addRoute({
  path: '/help',
  component: '@site/src/pages/help',
  exact: true,
});
```

And `createData` takes a file name relative to to your plugin's directory, a string for the `JSON.stringify` result of your data, and will return a path to the module which you may then use as the path to items in your `RouteModule`. The modules will be loaded when the related pages are loaded following our optimizations according to the [PRPL pattern](https://developers.google.com/web/fundamentals/performance/prpl-pattern/).

## configureWebpack(config, isServer, utils)

Modifies the internal webpack config. If the return value is a JavaScript object, it will be merged into the final config using [`webpack-merge`](https://github.com/survivejs/webpack-merge). If it is a function, it will be called and receive `config` as the first argument and an `isServer` flag as the argument argument.

### `config`

`configureWebpack` is called with `config` generated according to client/server build. You may treat this as the base config to be merged with.

### `isServer`

`configureWebpack` will be called both in server build and in client build. The server build receives `true` and the client build receives `false` as `isServer`.

### `utils`

The initial call to `configureWebpack` also receives a util object consists of three functions:

- `getStyleLoaders(isServer: boolean, cssOptions: {[key: string]: any}): Loader[]`
- `getCacheLoader(isServer: boolean, cacheOptions?: {}): Loader | null`
- `getBabelLoader(isServer: boolean, babelOptions?: {}): Loader`

You may use them to return your webpack configures conditionally.

Example:

```js
configureWebpack(config, isServer) {
  if (!isServer) {
    // mutate the webpack config for client

  }
  return config;
},
```

## postBuild(props)

Called when a (production) build finishes.

```ts
interface LoadContext {
  siteDir: string;
  generatedFilesDir: string;
  siteConfig: DocusaurusConfig;
  outDir: string;
  baseUrl: string;
}

interface Props extends LoadContext {
  routesPaths: string[];
  plugins: Plugin<any>[];
}
```

Example:

```js
async postBuild({siteConfig = {}, routesPaths = [], outDir}) {
  // Print out to console all the rendered routes
  routesPaths.map(route => {
    console.log(route);
  })
},
```

## extendCli(cli)

Register an extra command to enhance the CLI of docusaurus. `cli` is [commander](https://www.npmjs.com/package/commander) object.

Example:

```js
extendCli(cli) {
  cli
    .command('roll')
    .description('Roll a random number between 1 and 1000')
    .action(() => {
      console.log(Math.floor(Math.random() * 1000 + 1));
  });
},
```

## getThemePath()

Returns the path to the directory where the theme components can be found. When your users calls `swizzle`, `getThemePath` is called and its returned path is used to find your theme components.

If you use the folder directory above, your `getThemePath` can be:

```js
// my-theme/src/index.js
const path = require('path');

module.exports = function(context, options) {
  return {
    name: 'name-of-my-theme',
    getThemePath() {
      return path.resolve(__dirname, './theme');
    },
  };
};
```

## getClientModules()

Returns an array of paths to the modules that are to be imported in the client bundle. These modules are imported globally before React even renders the initial UI.

As an example, to make your theme load a `customCss` object from `options` passed in by the user:

```js
// my-theme/src/index.js
const path = require('path');

module.exports = function(context, options) {
  const {customCss} = options || {};
  return {
    name: 'name-of-my-theme',
    getClientModules() {
      return [customCss];
    },
  };
};
```

<!--
For example, the in docusaurus-plugin-content-docs:

    In loadContent, it loads the doc Markdown files based on the specified directory in options (defaulting to docs).
    In contentLoaded, for each doc Markdown file, a route is created: /doc/installation, /doc/getting-started, etc.
 -->

## Example

Mind model for a presumptuous plugin implementation.

```jsx
const DEFAULT_OPTIONS = {
  // Some defaults.
};

// A JavaScript function that returns an object.
// `context` is provided by Docusaurus. Example: siteConfig can be accessed from context.
// `opts` is the user-defined options.
module.exports = function(context, opts) {
  // Merge defaults with user-defined options.
  const options = {...DEFAULT_OPTIONS, ...options};

  return {
    // A compulsory field used as the namespace for directories to cache
    // the intermediate data for each plugin.
    // If you're writing your own local plugin, you will want it to
    // be unique in order not to potentially conflict with imported plugins.
    // A good way will be to add your own project name within.
    name: 'docusaurus-my-project-cool-plugin',

    async loadContent() {
      // The loadContent hook is executed after siteConfig and env has been loaded
      // You can return a JavaScript object that will be passed to contentLoaded hook
    },

    async contentLoaded({content, actions}) {
      // contentLoaded hook is done after loadContent hook is done
      // actions are set of functional API provided by Docusaurus. e.g: addRoute
    },

    async postBuild(props) {
      // after docusaurus <build> finish
    },

    // TODO
    async postStart(props) {
      // docusaurus <start> finish
    },

    // TODO
    afterDevServer(app, server) {
      // https://webpack.js.org/configuration/dev-server/#devserverbefore
    },

    // TODO
    beforeDevServer(app, server) {
      // https://webpack.js.org/configuration/dev-server/#devserverafter
    },

    configureWebpack(config, isServer) {
      // Modify internal webpack config. If returned value is an Object, it
      // will be merged into the final config using webpack-merge;
      // If the returned value is a function, it will receive the config as the 1st argument and an isServer flag as the 2nd argument.
    },

    getPathsToWatch() {
      // Path to watch
    },

    getThemePath() {
      // Returns the path to the directory where the theme components can
      // be found.
    },

    getClientModules() {
      // Return an array of paths to the modules that are to be imported
      // in the client bundle. These modules are imported globally before
      // React even renders the initial UI.
    },

    extendCli(cli) {
      // Register an extra command to enhance the CLI of docusaurus
    },
  };
};
```
