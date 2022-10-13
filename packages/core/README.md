<div align="center">
  <div>
    <img width="200" role="img" alt="PDEJS Logo" src="./apps/website/static/img/logo.svg" />
  </div>
  <h1>
    PDEJS
  </h1>
  <h3>
    🚜 CURRENTLY IN EARLY DEVELOPMENT 🚜
  </h3>
  <p>
    Breaking changes often may occur
  </p>
  <p>
    <a href="https://cam-inc.github.io/pde.js">Docs</a>
    <span>・</span>
    <a href="https://codesandbox.io/s/pdejs-demo-yo1787?file=/src/index.ts">Demo</a>
  </p>
  <p>
    <a href="https://github.com/cam-inc/pde.js/issues/new">Report Bugs / Request Features</a>
  </p>
</div>

## About PDEJS

PDEJS is inspired by Preact's reconciler implements.
We made the implements work standalone for constructing plugins of Editor.js through declarative UI programming.

### Why using Preact's reconciler

We first tried to incorporate React philosophy into the data management in the Editor.js block.
React is a UI library that includes a simple architecture concerned with the View of the MVC model.
In applications such as block editors that read and write a lot of data, an approach like React is
useful because managing data through DOM manipulation is very labor-intensive.
Therefore, we used React's mechanisms such as reconciliation and hooks to make data management simple
and explicit to improve the development experience.

However, React implementation is complex, even for a reconciler or hooks implementation.
Even if the same code could be run standalone, it would require time spent understanding the code,
making ongoing maintenance impractical. Therefore, we decide to utilize Preact for incorporating
the React philosophy without relying on React.

Preact is a library known as a lightweight alternative to React.
However, we consider that the superiority of Preact is not that it is a lighter library than React,
but it rewrites React with a minimum amount of code to make it more readable.
Hence, we worked on cloning the implements from Preact's reconciler and adjusted them for Editor.js
plugin development.

## Getting started

Required Node.js v16 or later.

### With TypeScript(recommended)

Install packages.

```shell
npm i @editorjs/editorjs @pdejs/core
```

```shell
npm i --save-dev typescript
```

Add `tsconfig.json`.

```json
{
  "compilerOptions": {
    "target": "es2016",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "jsx": "react"
  }
}
```

Write your first plugin as shown below.

```tsx
/* @jsx h */
import {
  h,
  useMount,
  useWatch,
  useState,
  PDJSX,
  createPlugin,
} from '@pdejs/core';

const Plugin = () => {
  const toolbox: PDJSX.ToolAttributes['static_get_toolbox'] = {
    title: 'Simple',
    icon: '⚔️',
  };
  const save: PDJSX.ToolAttributes['save'] = (blockContent) => {
    return blockContent.innerText;
  };

  const [inputValue, setInputValue] = useState('');
  const [submitValue, setSubmitValue] = useState('');
  const handleFormSubmit = (event: Event) => {
    event.preventDefault();
    setSubmitValue(inputValue);
  };
  const handleInputChange = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      setInputValue(event.target.value);
    }
  };

  useMount(() => {
    console.log('[@pdejs/simple] is ready to work!');
  });
  useWatch(() => {
    console.log(`[@pdejs/simple] submitted : `, submitValue);
  }, [submitValue]);

  return (
    <tool save={save} static_get_toolbox={toolbox}>
      <div>
        <form onSubmit={handleFormSubmit}>
          <label>
            type something→
            <input onChange={handleInputChange} value={inputValue} />
          </label>
          <button>submit</button>
        </form>
        <div>
          <span>submitted: </span>
          <span>{submitValue}</span>
        </div>
      </div>
    </tool>
  );
};

export const Simple = createPlugin(<Plugin />);
```

Create files for completing to setup. We recommend using `vite` for hosting locally.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Example - Simple</title>
  </head>
  <body>
    <div id="canvas"></div>
    <button id="save">save</button>
    <script type="module" src="/main.ts"></script>
  </body>
</html>
```

```ts
/* @jsx h */
import { Simple } from './plugin';
import EditorJS from '@editorjs/editorjs';

import './style.css';

const canvasElm = document.querySelector<HTMLDivElement>('#canvas');
const saveElm = document.querySelector<HTMLButtonElement>('#save');

if (!canvasElm) {
  throw new Error('Could not find the element#canvas');
}

const editor = new EditorJS({
  holder: canvasElm,
  tools: {
    simple: {
      class: Simple,
    },
  },
  onReady: () => {
    console.log('Editor.js is ready to work!');
  },
  onChange: (_, event) => {
    console.log("Now I know that Editor's content changed!", event);
  },
  autofocus: true,
  placeholder: "Let's write an awesome story!",
});

saveElm?.addEventListener('click', () => {
  editor
    .save()
    .then((outputData) => {
      console.log('saved: ', outputData);
    })
    .catch((error) => {
      console.log('save failded: ', error);
    });
});
```

It works :tada:

<img width="418" alt="pdejs-demo" src="https://user-images.githubusercontent.com/38882716/195280901-37a62a00-192b-4d69-95b4-2db1e4d430fa.png">

See the [source](https://github.com/cam-inc/pde.js/tree/main/examples/simple) for more information.

### With JavaScript

Install packages.

```shell
npm i @editorjs/editorjs @pdejs/core
```

```shell
npm i --save-dev @babel/core @babel/cli @babel/plugin-transform-react-jsx @babel/preset-env
```

Add `.babelrc`.

```json
{
  "presets": [["@babel/preset-env"]],
  "plugins": ["@babel/plugin-transform-react-jsx"]
}
```

Other steps are almost the same way of [With TypeScript](<#with-typescript(recommended)>).

### If you do not want to use `@jsx h`

Modify `compilerOptions.jsxFactory` in `tsconfig.json` or add `@babel/plugin-transform-react-jsx` for modifying [pragma](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#pragma) as follows.

**`tsconfig.json` (with `tsc`)**

```json
{
  "compilerOptions": {
    "jsxFactory": "h"
  }
}
```

**`.babelrc` (with `@babel-transform-react-jsx`)**

```json
{
  "plugins": [["transform-react-jsx", { "pragma": "h" }]]
}
```

## APIs

List up the available APIs.

### Core Functions

#### `h(type, config, children)`

Function for parsing JSX to object.

#### `createPlugin(element)`

Adapter function for Editor.js.
It receives PDEJS's JSXElement as an argument and returns Editor.js plugin class.

### JSXElement

See [types](https://github.com/cam-inc/pde.js/blob/main/packages/core/src/types.ts) for more information of JSXElement props.

#### `<tool>`

JSXElement for [Editor.js Tools API](https://editorjs.io/tools-api).

| Prop                             | Description                                                                   |        Required         | Data Format | Related Docs                                                   |
| -------------------------------- | ----------------------------------------------------------------------------- | :---------------------: | ----------- | -------------------------------------------------------------- |
| `children`                       | is children of PDEJS Element.                                                 | :ballot_box_with_check: | Array       | https://preactjs.com/guide/v10/api-reference/#h--createelement |
| `save`                           | extracts Block data from the UI.                                              | :ballot_box_with_check: | Function    | https://editorjs.io/tools-api#save                             |
| `validate`                       | validates Block data after saving.                                            |                         | Function    | https://editorjs.io/tools-api#validate                         |
| `renderSettings`                 | is object for the settings UI.                                                |                         | Object      | https://editorjs.io/tools-api#rendersettings                   |
| `destroy`                        | clears Tools stuff(cache, variables, events).                                 |                         | Function    | https://editorjs.io/tools-api#destroy                          |
| `onPaste`                        | handles content pasted.                                                       |                         | Function    | https://editorjs.io/tools-api#onpaste                          |
| `merge`                          | specifies how to merge two similar Blocks.                                    |                         | Function    | https://editorjs.io/tools-api#merge                            |
| `static_get_pasteConfig`         | allows your Tool to substitute pasted contents.                               |                         | Object      | https://editorjs.io/tools-api#pasteconfig                      |
| `static_get_sanitize`            | allows to clean unwanted HTMLElement or attributes.                           |                         | Object      | https://editorjs.io/tools-api#sanitize                         |
| `static_get_toolbox`             | decides icon and title. **REQUIRED if Tools should be added to the toolbox.** |                         | Object      | https://editorjs.io/tools-api#toolbox                          |
| `static_get_shortcut`            | registers a shortcut command.                                                 |                         | String      | https://editorjs.io/tools-api#shortcut                         |
| `static_get_conversionConfig`    | decides that Tool can be converted into/form anothor Tool.                    |                         | Object      | https://editorjs.io/tools-api#conversionconfig                 |
| `static_get_enableLineBreaks`    | handles Enter keydowns if it's set true.                                      |                         | Boolean     | https://editorjs.io/tools-api#enablelinebreaks                 |
| `static_get_isReadOnlySupported` | is a flag for supporting the read-only mode.                                  |                         | Boolean     | https://editorjs.io/tools-api#isreadonlysupported              |

#### `<inlineTool>`

JSXElement for [Editor.js Inline Tools API](https://editorjs.io/inline-tools-api-1).

| Prop                  | Description                                    |        Required         | Data Format   | Related Docs                                                   |
| --------------------- | ---------------------------------------------- | :---------------------: | ------------- | -------------------------------------------------------------- |
| `children`            | is children of PDEJS Element.                  | :ballot_box_with_check: | Array         | https://preactjs.com/guide/v10/api-reference/#h--createelement |
| `surround`            | works with selected range.                     | :ballot_box_with_check: | Function      | https://editorjs.io/inline-tools-api-1#surround                |
| `checkState`          | gets Tool's activated state by selected range. | :ballot_box_with_check: | Function      | https://editorjs.io/inline-tools-api-1#checkstate              |
| `renderActions`       | create additional element.                     |                         | Function      | https://editorjs.io/inline-tools-api-1#renderactions           |
| `clear`               | clears Tools stuff.                            |                         | Function      | https://editorjs.io/inline-tools-api-1#clear                   |
| `get_shortcut`        | sets a shortcut.                               |                         | String        | https://editorjs.io/inline-tools-api-1#shortcut                |
| `static_get_isInline` | specifies Tool as Inline Toolbar Tool.         | :ballot_box_with_check: | Boolean(true) | https://editorjs.io/inline-tools-api-1#isinline                |
| `static_sanitize`     | sanitizer rules.                               |                         | Function      | https://editorjs.io/inline-tools-api-1#sanitize                |
| `static_title`        | decides Tool's title.                          |                         | Function      | https://editorjs.io/inline-tools-api-1#title                   |

#### `<blockTune>`

JSXElement for [Editor.js Block Tunes API](https://editorjs.io/block-tunes-api)

| Prop                | Description                               |        Required         | Data Format   | Related Docs                                                   |
| ------------------- | ----------------------------------------- | :---------------------: | ------------- | -------------------------------------------------------------- |
| `children`          | is children of PDEJS Element.             | :ballot_box_with_check: | Array         | https://preactjs.com/guide/v10/api-reference/#h--createelement |
| `save`              | saves Tune's state.                       |                         | Function      | https://editorjs.io/block-tunes-api#save                       |
| `wrap`              | wraps Block's content element.            |                         | Function      | https://editorjs.io/block-tunes-api#wrap                       |
| `static_get_isTune` | specifies Tool as Block Tune.             |                         | Boolean(true) | https://editorjs.io/block-tunes-api#static-get-istune          |
| `static_prepare`    | makes any preparations required for Tune. |                         | Function      | https://editorjs.io/block-tunes-api#prepare                    |
| `static_reset`      | resets the value of `static_prepare`.     |                         | Function      | https://editorjs.io/block-tunes-api#reset                      |

### Hooks

#### `useReducer(reducer, initialState, initilizer)`

Update state by a provided reducer.

#### `useState(initialState)`

Returns state and state updater.

#### `useMount(callback)`

Execute callback when mounting DOM.

#### `useWatch(callback, deps)`

Execute callback when `deps` are changed.

#### `useConstructor()`

**UNSTABLE HOOK**

Be able to get the value of Editor.js plugin class constructor.

## Roadmap

- [x] Add types for custom JSX elements
- [x] Add a parser for JSX and syntax of Editor.js tools
  - [x] Prototyping(Add a simple parser)
  - [x] [Styles API support](https://editorjs.io/styles)
  - [x] [Access params of constructor as props](https://editorjs.io/tools-api#class-constructor)
- [x] Add unit & integration testing
- [x] Add implements of diff or reconcile
- [x] Add functions for transforming JSX nodes to plugin class syntax
- [ ] A11y support

## Contributing

```shell
git clone https://github.com/cam-inc/pde.js.git && cd pde.js && npm run preflight
```

## License

Apache-2.0 License

## Inspired

- https://github.com/preactjs/preact
<!-- ref. https://github.com/othneildrew/Best-README-Template/blob/master/README.md -->
