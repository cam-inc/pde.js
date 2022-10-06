/* @jsx h */
import ToolBlockParagraph from '@pdejs/tool-block-paragraph';
import ToolInlineMarker from '@pdejs/tool-inline-marker';
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
    myparagraph: {
      class: ToolBlockParagraph,
      inlineToolbar: true,
    },
    marker: {
      class: ToolInlineMarker,
    },
  },
  data: {
    blocks: [
      {
        type: 'myparagraph',
        data: {
          value: 'initial paragraph 01',
        },
      },
      {
        type: 'myparagraph',
        data: {
          value: 'initial paragraph 02',
        },
      },
    ],
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
      console.log('save failed: ', error);
    });
});
