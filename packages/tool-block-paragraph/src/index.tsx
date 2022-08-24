/* @jsx h */
import { h, useState } from '@pdejs/core';

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

  const toolbox = {
    // TODO: Editor.jsのi18n機能では不十分なので対応必要。
    title: 'Paragraph',
    // TODO: replace
    icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
  };

  const save = () => {};

  return (
    <tool static_get_toolbox={toolbox} save={save}>
      <div>{value}</div>
    </tool>
  );
};

export default Paragraph;

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
