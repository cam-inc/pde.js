import { createVNode } from '../../../src/create-element';
import { reconcileElements } from '../../../src/reconciler/elements';

describe('reconcileElements', () => {
  it('should create a valid dom', () => {
    const newVNode = createVNode({
      type: 'div',
      props: {},
      key: null,
      ref: null,
      original: null,
    });
    const oldVNode = createVNode({
      type: 'span',
      props: {},
      key: null,
      ref: null,
      original: null,
    });
    const dom = reconcileElements({
      dom: null,
      newVNode,
      oldVNode,
      commitQueue: [],
    });

    expect(dom).toBeTruthy();
    expect(dom instanceof HTMLDivElement).toBeTruthy();
  });
});
