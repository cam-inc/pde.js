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

## About PDEJS

A Package for constructing declarative Editor.js plugins.

### motivation

## Getting started

### Install (With TypeScript)

_We strongly recommend to use with TypeScript._

```shell
npm i @editorjs/editorjs @pdejs/core
```

Install typescript.

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

### Sample (With TypeScript)

```tsx
/* @jsx h */
import EditorJS, {
  API,
  BlockToolConstructorOptions,
  BlockToolData,
  InlineToolConstructorOptions,
  ToolConfig,
} from '@editorjs/editorjs';
import {
  h,
  useState,
  useWatch,
  createPlugin,
  useMount,
  useConstruct,
} from '@pdejs/core';

const WithHooks = () => {
  console.log('render or re-render');
  const [show, setShow] = useState(false);
  const [value, setValue] = useState('');
  const [text, setText] = useState('Ping');

  const [api, setApi] = useState<API | null>(null);
  const [config, setConfig] = useState<ToolConfig | null>(null);

  useMount(() => {
    setText('Pong');
  });

  useWatch(() => {
    console.log('[useWatch] show changed!: ', show);
  }, [show]);

  useWatch(() => {
    console.log('[useWatch] value changed!: ', value);
  }, [value]);

  const params = useConstruct<InlineToolConstructorOptions>();
  if (params != null) {
    setApi(params.api);
    setConfig(params.config);
  }

  const save = (blockContent: HTMLElement) => {
    return {
      text: blockContent.innerText,
    };
  };

  const handleClick = () => {
    setShow((prevState) => !prevState);
  };

  const handleChange = (e: Event) => {
    if (e.target instanceof HTMLInputElement) {
      setValue(e.target.value);
    }
  };

  const handleSubmit = (e: Event) => {
    setText(value);
    console.log('[handleSubmit] api:  ', api);
    console.log('[handleSubmit] config:  ', config);
    e.preventDefault();
  };

  return (
    <tool
      save={save}
      static_get_toolbox={{
        title: 'SampleWithHooks',
        icon: `<span>🧪</span>`,
      }}
    >
      <div>
        <span style={{ cursor: 'pointer' }} onClick={handleClick}>
          {text}
          {show && <span>'clicked!'</span>}
        </span>
        <div
          style={{
            width: '128px',
            height: '64px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'gray',
            color: 'white',
          }}
        >
          <form
            style={{
              width: '100%',
              padding: '8px',
            }}
            onSubmit={handleSubmit}
          >
            <input
              style={{ width: '100%' }}
              onChange={handleChange}
              value={value}
            />
            <input type="submit" value="Submit" />
          </form>
        </div>
        {api && <pre>{api.styles.inlineToolButton}</pre>}
      </div>
    </tool>
  );
};

const WithContentEdiable = () => {
  const [data, setData] = useState<BlockToolData | null>(null);

  const params = useConstruct<BlockToolConstructorOptions>();
  if (params != null) {
    setData(params.data);
  }

  return (
    <tool
      static_get_toolbox={{ title: 'SampleWithContentEdiable', icon: '✍️' }}
      save={() => {}}
    >
      <div contentEditable={true}>default value: {data?.value}</div>
    </tool>
  );
};

const WithSvg = () => {
  const surround = (range: Range) => {};
  const checkState = () => {};
  return (
    <inlineTool
      static_get_isInline={true}
      surround={surround}
      checkState={checkState}
    >
      <button class="ce-inline-tool">
        <svg width="20" height="18">
          <path d="M10.458 12.04l2.919 1.686-.781 1.417-.984-.03-.974 1.687H8.674l1.49-2.583-.508-.775.802-1.401zm.546-.952l3.624-6.327a1.597 1.597 0 0 1 2.182-.59 1.632 1.632 0 0 1 .615 2.201l-3.519 6.391-2.902-1.675zm-7.73 3.467h3.465a1.123 1.123 0 1 1 0 2.247H3.273a1.123 1.123 0 1 1 0-2.247z" />
        </svg>
      </button>
    </inlineTool>
  );
};

const CustomTool = () => {
  const handleClick = () => {
    console.log('clicked');
  };
  const handleSave = (blockContent: HTMLElement) => {
    return {
      text: blockContent.innerText,
    };
  };
  return (
    <tool
      save={handleSave}
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
      static_get_isInline={true}
    >
      <button class="ce-inline-tool">📝</button>
    </inlineTool>
  );
};

const CustomBlockTune = () => {
  return (
    <blockTune static_get_isTune={true}>
      <span>🎸</span>
    </blockTune>
  );
};

const containerElm = document.querySelector<HTMLDivElement>('#container');
const saveElm = document.querySelector<HTMLButtonElement>('#save');
const outputElm = document.querySelector<HTMLPreElement>('#output');

if (!containerElm) {
  throw new Error('Could not find the element#container');
}

if (!outputElm) {
  throw new Error('Cloud not find the element#output');
}

const editor = new EditorJS({
  holder: containerElm,
  tools: {
    withHooks: {
      class: createPlugin(<WithHooks />),
    },
    withContentEditable: {
      class: createPlugin(<WithContentEdiable />),
    },
    withSvg: {
      class: createPlugin(<WithSvg />),
    },
    customTool: {
      class: createPlugin(<CustomTool />),
    },
    customInlineTool: {
      class: createPlugin(<CustomInlineTool />),
      inlineToolbar: true,
    },
    customBlockTune: {
      class: createPlugin(<CustomBlockTune />),
    },
  },
  data: {
    blocks: [
      {
        type: 'withContentEditable',
        data: {
          value: 'initial paragraph 01',
        },
      },
      {
        type: 'withContentEditable',
        data: {
          value: 'initial paragraph 02',
        },
      },
    ],
  },
  tunes: ['customBlockTune'],
  onReady: () => {
    console.log('[EDITORJS] Editor.js is ready to work!');
  },
  onChange: (_, event) => {
    console.log("[EDITORJS] Now I know that Editor's content changed!", event);
  },
  autofocus: true,
  placeholder: "Let's write an awesome story!",
});

saveElm?.addEventListener('click', () => {
  editor
    .save()
    .then((outputData) => {
      outputElm.innerText = JSON.stringify(outputData);
    })
    .catch((error) => {
      outputElm.innerText = JSON.stringify(error);
    });
});
```

### Install (With JavaScript)

```shell
npm i @editorjs/editorjs @pdejs/core
```

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
