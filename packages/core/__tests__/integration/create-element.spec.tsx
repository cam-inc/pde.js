import { h, Fragment } from '../../src';
import { hasOwnProperty } from '../../src/helpers';

describe('h', () => {
  it('should create vnode', () => {
    const vNode = h('div', { title: 'test', key: 'test' });
    expect(vNode).toBeTruthy();
    expect(hasOwnProperty(vNode.props, 'key')).toBeFalsy();
    expect(hasOwnProperty(vNode.props, 'ref')).toBeFalsy();
  });
});

describe('Fragment', () => {
  it('should create children from vNode', () => {
    const vNode = h('div', {}, h('span', { title: 'child' }));
    expect(vNode).toBeTruthy();

    const children = Fragment(vNode.props);
    expect(children).toBeTruthy();
  });
});
