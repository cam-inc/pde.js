import { reconcileProps } from '../../../src/reconciler/props';
import { h } from '../../../src';
import { isObjectFactory } from '../../../src/helpers';

describe('reconcileProps', () => {
  it('should apply the event handler prop to dom', () => {
    const dom = document.createElement('div');

    const onClick = jest.fn();
    const onChange = jest.fn();
    const newVNode = h('button', { onClick });
    const oldVNode = h('button', { onChange });

    reconcileProps({
      dom,
      newProps: newVNode.props,
      oldProps: oldVNode.props,
    });

    dom.dispatchEvent(new Event('click'));
    dom.dispatchEvent(new Event('change'));

    expect(onClick).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledTimes(0);
  });

  it.each([
    {
      name: 'string -> string',
      newStyle: 'background: red; width: 24px; height: 100%; display: inline;',
      oldStyle: 'background: blue; width: 12px; height: auto;',
    },
    {
      name: 'object -> object',
      newStyle: {
        background: 'red',
        width: 24,
        height: '100%',
        display: 'inline',
      },
      oldStyle: {
        background: 'blue',
        width: 12,
        height: 'auto',
      },
    },
    {
      name: 'string -> object',
      newStyle: {
        background: 'red',
        width: 24,
        height: '100%',
        display: 'inline',
      },
      oldStyle: 'background: blue; width: 12px; height: auto;',
    },
    {
      name: 'object -> string',
      newStyle: 'background: red; width: 24px; height: 100%; display: inline;',
      oldStyle: {
        background: 'blue',
        width: 12,
        height: 'auto',
      },
    },
    {
      name: 'equal(object -> object)',
      newStyle: {
        background: 'red',
        width: 24,
        height: '100%',
        display: 'inline',
      },
      oldStyle: {
        background: 'red',
        width: 24,
        height: '100%',
        display: 'inline',
      },
    },
    {
      name: 'equal(string -> string)',
      newStyle: 'background: red; width: 24px; height: 100%; display: inline;',
      oldStyle: 'background: red; width: 24px; height: 100%; display: inline;',
    },
  ])(
    '[$name] should apply the style prop to dom',
    ({ name, newStyle, oldStyle }) => {
      const dom = document.createElement('div');
      const newVNode = h('button', { style: newStyle });
      const oldVNode = h('button', { style: oldStyle });

      reconcileProps({
        dom,
        newProps: newVNode.props,
        oldProps: oldVNode.props,
      });

      expect(dom.style).toBeTruthy();

      if (name.includes('equal')) {
        // NOTE: Is it a kind of bug?
        const { isEmptyObject } = isObjectFactory((dom.style as any)._values);
        expect(isEmptyObject).toBeTruthy();
      } else {
        expect((dom.style as any)._values).toMatchObject({
          background: 'red',
          width: '24px',
          height: '100%',
          display: 'inline',
        });
      }
    }
  );
});
