/* @jsx h */
import { createPlugin, h, useEffect, useState } from '@pdejs/core';
import type {
  API,
  InlineTool,
  InlineToolConstructorOptions,
  ToolConfig,
} from '@editorjs/editorjs';

export type Config = {
  bar: boolean;
};
type Container = HTMLButtonElement;

const Marker = () => {
  const [api, setApi] = useState<API | null>(null);
  const [config, setConfig] = useState<ToolConfig<Config> | null>(null);
  const [marked, setMarked] = useState(false);

  const initializer = ({ api, config }: InlineToolConstructorOptions) => {
    setApi(api);
    setConfig(config);
  };

  const surround = () => {};

  const checkState = () => {};

  useEffect(() => {
    console.log('api: ', api);
    console.log('config: ', config);
  }, [api, config]);

  return (
    <inlineTool
      initializer={initializer}
      static_get_isInline={true}
      surround={surround}
      checkState={checkState}
    >
      <div class={api?.styles.inlineToolButton}>
        <svg width="20" height="18">
          <path d="M10.458 12.04l2.919 1.686-.781 1.417-.984-.03-.974 1.687H8.674l1.49-2.583-.508-.775.802-1.401zm.546-.952l3.624-6.327a1.597 1.597 0 0 1 2.182-.59 1.632 1.632 0 0 1 .615 2.201l-3.519 6.391-2.902-1.675zm-7.73 3.467h3.465a1.123 1.123 0 1 1 0 2.247H3.273a1.123 1.123 0 1 1 0-2.247z" />
        </svg>
      </div>
    </inlineTool>
  );
};

export default createPlugin(<Marker />);

class _Marker implements InlineTool {
  private api: API;
  private config?: ToolConfig<Config>;
  private container: Container;
  private state: boolean;

  static get isInline(): boolean {
    return true;
  }

  constructor({ api, config }: InlineToolConstructorOptions) {
    this.api = api;
    this.config = config;
    this.container = document.createElement('button');
    this.state = false;
  }

  surround(range: Range) {
    if (this.state) {
      this.unwrap(range);
    } else {
      this.wrap(range);
    }
  }

  checkState(/*selection: Selection*/) {
    const mark = this.api.selection.findParentTag('mark');
    this.state = !!mark;
    this.container.classList.toggle(
      this.api.styles.inlineToolButtonActive,
      this.state
    );
    // TODO: interface側に問題あり。
    return this.state;
  }

  render(): Container {
    this.container.innerHTML =
      '<svg width="20" height="18"><path d="M10.458 12.04l2.919 1.686-.781 1.417-.984-.03-.974 1.687H8.674l1.49-2.583-.508-.775.802-1.401zm.546-.952l3.624-6.327a1.597 1.597 0 0 1 2.182-.59 1.632 1.632 0 0 1 .615 2.201l-3.519 6.391-2.902-1.675zm-7.73 3.467h3.465a1.123 1.123 0 1 1 0 2.247H3.273a1.123 1.123 0 1 1 0-2.247z"/></svg>';
    this.container.classList.add(this.api.styles.inlineToolButton);
    return this.container;
  }

  private wrap(range: Range) {
    const selectedText = range.extractContents();
    const mark = document.createElement('mark');
    mark.appendChild(selectedText);
    range.insertNode(mark);
    this.api.selection.expandToTag(mark);
  }

  private unwrap(range: Range) {
    const mark = this.api.selection.findParentTag('mark');
    const text = range.extractContents();
    mark?.remove();
    range.insertNode(text);
  }
}
