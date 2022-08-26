/* @jsx h */
import EditorJS, {
  API,
  InlineToolConstructorOptions,
} from '@editorjs/editorjs';
import { h, useState, useEffect, createPlugin } from '../../../../src';
import type { PDJSX } from '../../../../src/';

const SampleWithHooks = () => {
  console.log('render or re-render');

  const [show, setShow] = useState(true);
  const [text, setText] = useState('Hello');
  const [api, setApi] = useState<API | null>(null);

  useEffect(() => {
    console.log('(show in useEffect)', show);
  }, [show]);

  useEffect(() => {
    console.log('(text in useEffect)', text);
  }, [text]);

  useEffect(() => {
    console.log('(api in useEffect)', api);
  }, [api]);

  const initializer = ({ api, config }: InlineToolConstructorOptions) => {
    setApi(api);
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
      setText(e.target.value);
    }
  };

  const handleSubmit = (e: Event) => {
    console.log('text submitted: ', text);
    console.log('api submitted: ', api);
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
        <span onClick={handleClick}>{text}</span>
        {/*{show && (*/}
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
            style={{ width: '100%', padding: '8px' }}
            onSubmit={handleSubmit}
          >
            <input
              style={{ width: '100%' }}
              onChange={handleChange}
              value={text}
            />
            <input type="submit" value="Submit" />
          </form>
        </div>
        {/*)}*/}
        {api && <pre>{api.styles.inlineToolButton}</pre>}
      </div>
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
    console.log('CustomTool', params);
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
    console.log('CustomInlineTool', params);
  };
  return (
    <inlineTool
      initializer={initializer}
      surround={() => {}}
      checkState={() => {}}
      static_get_isInline={true}
    >
      <div className="inline-tool-container">
        <span className="ce-inline-tool">📝</span>
      </div>
    </inlineTool>
  );
};

const CustomBlockTune = () => {
  const initializer: PDJSX.BlockTuneAttributes['initializer'] = (params) => {
    console.log('CustomBlockTune', params);
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

const editor = new EditorJS({
  holder: containerElm,
  tools: {
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
    sampleWithHooks: {
      class: createPlugin(<SampleWithHooks />),
    },
  },
  data: {
    blocks: [],
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
      if (outputElm !== null) {
        outputElm.innerText = JSON.stringify(outputData);
      }
    })
    .catch((error) => {
      if (outputElm !== null) {
        outputElm.innerText = JSON.stringify(error);
      }
    });
});
