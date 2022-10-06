/* @jsx h */
import { Simple } from './plugin';
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
    simple: {
      class: Simple,
    },
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
      console.log('save failded: ', error);
    });
});
