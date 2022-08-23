/* @jsx h */
import EditorJS from '@editorjs/editorjs';
import { h, useState, useEffect, createPlugin } from '../../../../dist/es';
import type { PDJSX } from '../../../../dist/types';

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
    console.log(params);
  };
  return (
    <tool
      initializer={initializer}
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

const SampleWithHooks = () => {
  const [show, setShow] = useState(true);
  const [text, setText] = useState('Hello');
  const handleClick = () => {
    setShow((prevState) => !prevState);
  };
  const handleChange = (e: Event) => {
    if (e.target instanceof HTMLInputElement) {
      setText(e.target.value);
    }
  };
  useEffect(() => {
    console.log(text);
  }, [text]);
  const save = (blockContent: HTMLElement) => {
    return {
      text: blockContent.innerText,
    };
  };
  return (
    <tool
      save={save}
      static_get_toolbox={{ title: 'SampleWithHooks', icon: '<span>🧪</span>' }}
    >
      <div>
        <span onClick={handleClick}>{text}</span>
        {show && (
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
            <form style={{ width: '100%', padding: '8px' }}>
              <input style={{ width: '100%' }} onChange={handleChange} />
            </form>
          </div>
        )}
      </div>
    </tool>
  );
};

const CustomInlineTool = () => {
  const initializer: PDJSX.InlineToolAttributes['initializer'] = (params) => {
    console.log(params);
  };
  return (
    <inlineTool
      initializer={initializer}
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
  const initializer: PDJSX.BlockTuneAttributes['initializer'] = (params) => {
    console.log(params);
  };
  return (
    <blockTune
      initializer={initializer}
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
          {/* test comment */}
          <button>button</button>
          <button>button</button>
          <button>button</button>
          <button>button</button>
          <button>button</button>
        </div>
      </div>
    </blockTune>
  );
};

const e = document.createElement('div');
e.id = 'editorjs';
document.body.appendChild(e);

const customTool = createPlugin(<CustomTool />);
const sampleWithHooks = createPlugin(<SampleWithHooks />);
const customInlineTool = createPlugin(<CustomInlineTool />);
const customBlockTune = createPlugin(<CustomBlockTune />);

const editor = new EditorJS({
  holder: 'editorjs',
  tools: {
    customTool,
    sampleWithHooks,
    customInlineTool,
    customBlockTune,
  },
});

editor.isReady.then(() => {
  const saveButton = document.createElement('button');
  saveButton.innerText = 'save';
  saveButton.addEventListener('click', () => {
    editor.save().then((output) => {
      const outputContainer = document.createElement('pre');
      outputContainer.innerText = JSON.stringify(output);
      document.body.appendChild(outputContainer);
    });
  });
  document.body.appendChild(saveButton);
});