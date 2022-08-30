/* @jsx h */
import { createPlugin, h, useEffect, useState } from '@pdejs/core';

import type {
  API,
  BlockAPI,
  BlockTool,
  BlockToolData,
  BlockToolConstructorOptions,
  ToolConfig,
  ToolboxConfig,
} from '@editorjs/editorjs';

export type Data = {
  value: string;
  settingA?: boolean;
  settingB?: boolean;
};
export type Config = {
  bar: boolean;
};
type Container = HTMLDivElement;
type SettingsContainer = HTMLDivElement;

const Paragraph = () => {
  const [value, setValue] = useState('');
  const [api, setApi] = useState<API | null>(null);
  const [data, setData] = useState<BlockToolData<Data> | null>(null);
  const [config, setConfig] = useState<ToolConfig<Config> | null>(null);
  const [blockApi, setBlockApi] = useState<BlockAPI | null>(null);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    console.log('[useEffect] data ', data);
    if (data != null) {
      setValue(data.value);
    }
  }, [data]);

  const toolbox = {
    // TODO: Editor.jsのi18n機能では不十分なので対応必要。
    title: 'Paragraph',
    // TODO: replace
    icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
  };

  const initializer = ({
    api,
    data,
    config,
    block,
    readOnly,
  }: BlockToolConstructorOptions) => {
    setApi(api);
    setData(data);
    setConfig(config);
    setBlockApi(block ?? null);
    setReadOnly(!!readOnly);
  };

  const save = (container: HTMLElement) => {
    return {
      ...data,
      ...{
        value: container.innerHTML,
      },
    };
  };

  const validate = (data: BlockToolData<Data>) => {
    return !!data.value;
  };

  // TODO: Enable to use JSX or abondon this API.
  const renderSettings = {
    wrapper: `<div><div/>`,
    button: `<button class="cdx-settings-button"></button>`,
    icons: [
      {
        name: 'withBorder',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`,
      },
      {
        name: 'stretched',
        icon: `<svg width="17" height="10" viewBox="0 0 17 10" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.511L4.084 3.787h9.606l-1.85-1.85a1.069 1.069 0 1 1 1.512-1.51l3.792 3.791a1.069 1.069 0 0 1-.475 1.788L13.514 9.16a1.125 1.125 0 0 1-1.59-1.591l1.644-1.644z"/></svg>`,
      },
      {
        name: 'withBackground',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.043 8.265l3.183-3.183h-2.924L4.75 10.636v2.923l4.15-4.15v2.351l-2.158 2.159H8.9v2.137H4.7c-1.215 0-2.2-.936-2.2-2.09v-8.93c0-1.154.985-2.09 2.2-2.09h10.663l.033-.033.034.034c1.178.04 2.12.96 2.12 2.089v3.23H15.3V5.359l-2.906 2.906h-2.35zM7.951 5.082H4.75v3.201l3.201-3.2zm5.099 7.078v3.04h4.15v-3.04h-4.15zm-1.1-2.137h6.35c.635 0 1.15.489 1.15 1.092v5.13c0 .603-.515 1.092-1.15 1.092h-6.35c-.635 0-1.15-.489-1.15-1.092v-5.13c0-.603.515-1.092 1.15-1.092z"/></svg>`,
      },
    ],
  };

  return (
    <tool
      initializer={initializer}
      static_get_toolbox={toolbox}
      save={save}
      validate={validate}
      renderSettings={renderSettings}
    >
      <div contentEditable={readOnly}>{value}</div>
    </tool>
  );
};

class _Paragraph implements BlockTool {
  static get toolbox(): ToolboxConfig {
    return {
      // TODO: Editor.jsのi18n機能では不十分なので対応必要。
      title: 'Paragraph',
      // TODO: replace
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
    };
  }

  private api: API;
  private data: BlockToolData<Data>;
  private config?: ToolConfig<Config>;
  private blockApi?: BlockAPI;
  private readOnly: boolean;
  private container: Container;
  private settingsContainer: Container;

  constructor({
    api,
    data,
    config,
    block,
    readOnly,
  }: BlockToolConstructorOptions<Data, Config>) {
    this.api = api;
    this.data = data;
    this.config = config;
    this.blockApi = block;
    this.readOnly = readOnly;
    this.container = document.createElement('div');
    this.settingsContainer = document.createElement('div');
  }

  save(container: Container): BlockToolData<Data> {
    return {
      ...this.data,
      ...{
        value: container.innerHTML,
      },
    };
  }

  validate(data: BlockToolData<Data>) {
    return !!data.value;
  }

  render(): Container {
    this.container.innerHTML = this.data.value;
    if (this.readOnly) {
      this.container.contentEditable = 'false';
    } else {
      this.container.contentEditable = 'true';
    }
    return this.container;
  }

  renderSettings(): SettingsContainer {
    const settings = [
      {
        name: 'settingA',
      },
      {
        name: 'settingB',
      },
    ];
    settings.forEach((setting) => {
      const button = document.createElement('button');
      button.innerHTML = setting.name;
      button.addEventListener('click', () => {
        // @ts-expect-error It can assign values.
        this.data[setting.name] = !this.data[setting.name];
      });
      this.settingsContainer.appendChild(button);
    });
    return this.settingsContainer;
  }
}

export default createPlugin(<Paragraph />);
// export default _Paragraph;
