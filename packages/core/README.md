<div align="center">
  <h1>
    ⚔️  PDEJS ⚔️
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
    <a href="https://codesandbox.io/s/focused-merkle-ky84t5?file=/src/index.tsx">Demo</a>
    <span>・</span>
    <a href="https://github.com/cam-inc/pde.js/issues/new">Report Bugs | Request Features</a>
  </p>
</div>

## About PDEJS

PDEJS is inspired by Preact's reconciler implements.
We make the implements working standalone for making plugins of Editor.js through declarative ui programming.

### Why using Preact

We first tried to incorporate React philosophy into the data management in the Editor.js block.
React is a UI library includes a simple architecture concerned with the View of MVC model.
In applications such as block editors that read and write a lot of data, an approach like React is useful because managing data through DOM manipulation is very labor intensive.
Therefore, we used React's mechanisms such as reconciliation and hooks to make data management simple and explicit to improve the development experience.

However, React implementation is complex, even for a reconciler or hooks implementation.
Even if the exact same code could be run standalone, it would require time spent understanding the code, making ongoing maintenance impractical.
Therefore, we decide to utilze Preact for incorporating the React philosophy without relying on React.

Preact is a library known as a lightweight alternative of React.
However, we consider that the superiority of the Preact is not that it is a lighter library than React, but it rewrites React with a minimum amount of code to make it more readable.

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

Write your first plugin like shown below.

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

Create files for completing to setup. We recommend to use `vite` for hosting locally.

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

[image]

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

Other steps are almostly the same way of the [With TypeScript](<#with-typescript(recommended)>).

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
