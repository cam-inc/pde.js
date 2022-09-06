/* @jsx h */
import {
  createPlugin,
  h,
  useWatch,
  useState,
  useConstruct,
  useMount,
} from '@pdejs/core';
import type { API, InlineToolConstructorOptions } from '@editorjs/editorjs';

export type Config = {
  bar: boolean;
};

const Marker = () => {
  const [api, setApi] = useState<API | null>(null);
  const [marked, setMarked] = useState(false);

  const params = useConstruct<InlineToolConstructorOptions>();
  if (params != null) {
    setApi(params.api);
  }

  useMount(() => {
    if (params != null) {
      setApi(params.api);
    }
  });

  const unwrap = (range: Range) => {
    const mark = api?.selection.findParentTag('mark');
    const text = range.extractContents();
    mark?.remove();
    range.insertNode(text);
  };

  const wrap = (range: Range) => {
    const selectedText = range.extractContents();
    const mark = document.createElement('mark');
    mark.appendChild(selectedText);
    range.insertNode(mark);
    api?.selection.expandToTag(mark);
  };

  const surround = (range: Range) => {
    if (marked) {
      unwrap(range);
    } else {
      wrap(range);
    }
  };

  const checkState = () => {
    const mark = api?.selection.findParentTag('mark');
    setMarked(!!mark);
  };

  useWatch(() => {
    console.log('api: ', api);
  }, [api]);

  useWatch(() => {
    console.log('marked ', marked);
  }, [marked]);

  return (
    <inlineTool
      static_get_isInline={true}
      surround={surround}
      checkState={checkState}
    >
      <button
        class={`${api?.styles.inlineToolButton} ${
          marked ? api?.styles.inlineToolButtonActive : ''
        }`}
      >
        <svg width="20" height="18">
          <path d="M10.458 12.04l2.919 1.686-.781 1.417-.984-.03-.974 1.687H8.674l1.49-2.583-.508-.775.802-1.401zm.546-.952l3.624-6.327a1.597 1.597 0 0 1 2.182-.59 1.632 1.632 0 0 1 .615 2.201l-3.519 6.391-2.902-1.675zm-7.73 3.467h3.465a1.123 1.123 0 1 1 0 2.247H3.273a1.123 1.123 0 1 1 0-2.247z" />
        </svg>
      </button>
    </inlineTool>
  );
};

export default createPlugin(<Marker />);
