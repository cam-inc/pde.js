/* @jsx h */
import EditorJS, {
  API,
  BlockToolConstructorOptions,
  BlockToolData,
  InlineToolConstructorOptions,
  ToolConfig,
} from '@editorjs/editorjs';
import { h, useState, useEffect, createPlugin } from '../../../../src';
import type { PDJSX } from '../../../../src/';

const SampleWithHooks = () => {
  console.log('render or re-render');

  const [show, setShow] = useState(false);
  const [value, setValue] = useState('');
  const [text, setText] = useState('Ping');

  const [api, setApi] = useState<API | null>(null);
  const [config, setConfig] = useState<ToolConfig | null>(null);

  useEffect(() => {
    console.log('[useEffect] show changed!: ', show);
  }, [show]);

  useEffect(() => {
    console.log('[useEffect] value changed!: ', value);
  }, [value]);

  useEffect(() => {
    console.log('[useEffect] api changed!: ', api);
  }, [api]);

  const initializer = ({ api, config }: InlineToolConstructorOptions) => {
    setApi(api);
    setConfig(config);
  };

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
      initializer={initializer}
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

const SampleWithContentEdiable = () => {
  const [data, setData] = useState<BlockToolData | null>(null);
  const initializer = ({ data }: BlockToolConstructorOptions) => {
    setData(data);
  };
  useEffect(() => {
    console.log('[useEffect data] ', data?.value);
  }, [data]);
  return (
    <tool
      initializer={initializer}
      static_get_toolbox={{ title: 'SampleWithContentEdiable', icon: '✍️' }}
      save={() => {}}
    >
      <div contentEditable={true}>default value: {data?.value}</div>
    </tool>
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
  const initializer: PDJSX.ToolAttributes['initializer'] = (params) => {
    console.log('[CustomTool] ', params);
  };
  return (
    <tool
      initializer={initializer}
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
  const initializer: PDJSX.InlineToolAttributes['initializer'] = (params) => {
    console.log('[CustomInlineTool] ', params);
  };
  return (
    <inlineTool
      initializer={initializer}
      surround={() => {}}
      checkState={() => {}}
      static_get_isInline={true}
    >
      <div className="ce-inline-tool">
        <span>📝</span>
      </div>
    </inlineTool>
  );
};

const CustomBlockTune = () => {
  const initializer: PDJSX.BlockTuneAttributes['initializer'] = (params) => {
    console.log('[CustomBlockTune] ', params);
  };
  return (
    <blockTune initializer={initializer} static_get_isTune={true}>
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
    sampleWithHooks: {
      class: createPlugin(<SampleWithHooks />),
    },
    sampleWithContentEditable: {
      class: createPlugin(<SampleWithContentEdiable />),
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
        type: 'sampleWithContentEditable',
        data: {
          value: 'initial paragraph 01',
        },
      },
      {
        type: 'sampleWithContentEditable',
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
