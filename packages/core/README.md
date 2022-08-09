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
    <a href="https://codesandbox.io/s/focused-merkle-ky84t5?file=/src/index.tsx">Live Demo</a>
    <span>・</span>
    <a href="https://github.com/cam-inc/pde.js/issues/new">Report Bugs | Request Features</a>
  </p>
</div>

## About @pdejs/core

A Package for constructing declarative Editor.js plugins.

### motivation

## Getting started

### Install

```shell
npm i @editorjs/editorjs @pdejs/core
```

### With JavaScript(babel)

Install dependencies related with babel.

```shell
npm i --save-dev @babel/core @babel/cli @babel/plugin-transform-react-jsx @babel/preset-env
```

Add `.babelrc` like shown below.

```json
{
  "presets": [["@babel/preset-env"]],
  "plugins": ["@babel/plugin-transform-react-jsx"]
}
```

Sample code

```jsx
/* @jsx h */
import { h, createPlugin } from '@pdejs/core';
import EditorJS from '@editorjs/editorjs';

const CustomTool = () => {
  const handleClick = () => {
    console.log('clicked');
  };
  const handleSave = (blockContent) => console.log(blockContent.value);
  return (
    <tool
      save={handleSave}
      validate={undefined}
      renderSettings={undefined}
      destory={undefined}
      onPaste={undefined}
      merge={undefined}
      static_get_pasteConfig={undefined}
      static_get_sanitize={undefined}
      static_get_shortcut={undefined}
      static_get_conversionConfig={undefined}
      static_get_enableLineBreaks={undefined}
      static_get_isReadOnlySupported={undefined}
      static_get_toolbox={{ title: 'CustomTool', icon: '<span>🔮</span>' }}
    >
      <div>
        <button
          style={{ border: 'none', cursor: 'pointer' }}
          onClick={handleClick}
        >
          button
        </button>
      </div>
    </tool>
  );
};

const CustomInlineTool = () => {
  return (
    <inlineTool
      surround={() => {}}
      checkState={() => {}}
      renderActions={undefined}
      clear={undefined}
      static_get_isInline={true}
      get_shortcut={undefined}
      static_get_sanitize={undefined}
      static_get_title={undefined}
    >
      <div className="inline-tool-container">
        <span className="ce-inline-tool">📝</span>
      </div>
    </inlineTool>
  );
};

const CustomBlockTune = () => {
  return (
    <blockTune
      save={undefined}
      wrap={undefined}
      static_get_isTune={true}
      static_prepare={undefined}
      static_reset={undefined}
    >
      <div>
        <span>BlockTune</span>
        <div>
          <span>nested</span>
        </div>
        <span />
        <div>
          <button>button</button> {/* inserted block */}
          <button>button</button> {/* inserted block */}
          <button>button</button> {/* inserted block */}
          <button>button</button> {/* inserted block */}
          <button>button</button> {/* inserted block */}
        </div>
      </div>
    </blockTune>
  );
};

const customTool = createPlugin(<CustomTool />);
const customInlineTool = createPlugin(<CustomInlineTool />);
const customBlockTune = createPlugin(<CustomBlockTune />);

const e = document.createElement('div');
e.id = 'editorjs';
document.body.appendChild(e);

new EditorJS({
  holder: 'editorjs',
  tools: {
    customTool,
    CustomInlineTool: { class: customInlineTool },
    CustomBlockTune: { class: customBlockTune },
  },
});
```

[Example]()

### With TypeScript

Strongly recommended to use with TypeScript

```shell
npm i --save-dev typescript
```

Add `tsconfig.json` like shown below.

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

Sample code

```tsx
/* @jsx h */
import { h, createPlugin } from '@pdejs/core';
import type { PDJSX } from '@pdejs/core';
import EditorJS from '@editorjs/editorjs';

const CustomTool: PDJSX.Tool = () => {
  const handleClick = () => {
    console.log('clicked');
  };
  const handleSave: PDJSX.ToolAttributes<{ value: string }>['save'] = (
    blockContent
  ) => console.log(blockContent.value);
  return (
    <tool
      save={handleSave}
      validate={undefined}
      renderSettings={undefined}
      destory={undefined}
      onPaste={undefined}
      merge={undefined}
      static_get_pasteConfig={undefined}
      static_get_sanitize={undefined}
      static_get_shortcut={undefined}
      static_get_conversionConfig={undefined}
      static_get_enableLineBreaks={undefined}
      static_get_isReadOnlySupported={undefined}
      static_get_toolbox={{ title: 'CustomTool', icon: '<span>🔮</span>' }}
    >
      <div>
        <button onClick={handleClick}>button</button>
      </div>
    </tool>
  );
};

const CustomInlineTool: PDJSX.InlineTool = () => {
  return (
    <inlineTool
      surround={() => {}}
      checkState={() => {}}
      renderActions={undefined}
      clear={undefined}
      static_get_isInline={true}
      get_shortcut={undefined}
      static_get_sanitize={undefined}
      static_get_title={undefined}
    >
      <div>
        <span>InlineTool</span>
      </div>
    </inlineTool>
  );
};

const CustomBlockTune: PDJSX.BlockTune = () => {
  return (
    <blockTune
      save={undefined}
      wrap={undefined}
      static_get_isTune={true}
      static_prepare={undefined}
      static_reset={undefined}
    >
      <div>
        <span>BlockTune</span>
        <div>
          <span>nested</span>
        </div>
        <span />
        <div>
          <button>button</button>
        </div>
      </div>
    </blockTune>
  );
};

const customTool = createPlugin(<CustomTool />, null);
const customInlineTool = createPlugin(<CustomInlineTool />, null);
const customBlockTune = createPlugin(<CustomBlockTune />, null);

const e = document.createElement('div');
e.id = 'editorjs';
document.body.appendChild(e);

new EditorJS({
  holderId: 'editorjs',
  tools: {
    customTool,
    CustomInlineTool: { class: customInlineTool },
    CustomBlockTune: { class: customBlockTune },
  },
});
```

[Example]()

### N.B.

If you do not want to use `@jsx h`, you can use @pdejs/core by modifying `@babel/plugin-transform-react-jsx` pragma or compilerOptions.jsxFactory in tsconfig.json as follows.

**`.babelrc` (with `@babel-transform-react-jsx`)**

```json
{
  "plugins": [["transform-react-jsx", { "pragma": "h" }]]
}
```

**`tsconfig.json` (with `tsc`)**

```json
{
  "compilerOptions": {
    "jsxFactory": "h"
  }
}
```

## Roadmap

- [x] Add skelton
- [x] Add types for custom JSX elements
- [ ] Add a parser for JSX and syntax of Editor.js tools
  - [x] Prototyping(Add a simple parser)
  - [x] [Styles API support](https://editorjs.io/styles)
  - [x] [Access params of constructor as props](https://editorjs.io/tools-api#class-constructor)
  - [ ] [JSX as props](https://github.com/cam-inc/pde.js/core/blob/2152be5020b83c75ac8c0d456a07b2ca5fc260fc/packages/core/src/types.ts#L64)
- [x] Add unit & integration testing
- [x] Add implements of diff or reconcile
- [x] Add functions for transforming JSX nodes to plugin class syntax
- [ ] A11y support

## Contributing

```shell
git clone https://github.com/cam-inc/pde.js.git && cd pde.js && npm run preflight
```

## License

MIT License

## Contact

## Inspired

- https://github.com/preactjs/preact
<!-- ref. https://github.com/othneildrew/Best-README-Template/blob/master/README.md -->
