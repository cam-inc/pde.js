import {
  isWhiteSpace,
  isEditorJSVNode,
  isObjectFactory,
  parseObjectToCssText,
} from '../../src/helpers';

describe('isWhiteSpace', () => {
  it('should work well', () => {
    expect(isWhiteSpace(' ')).toBeTruthy();
    expect(isWhiteSpace('test')).toBeFalsy();
  });
});

describe('isEditorJSVNode', () => {
  it('should work well', () => {
    const editorJSVNodeType = 'tool';
    const vNodeType = 'div';
    expect(isEditorJSVNode(editorJSVNodeType)).toBeTruthy();
    expect(isEditorJSVNode(vNodeType)).toBeFalsy();
  });
});

describe('isObjectFactory', () => {
  it('should detect an existence of properties in the object', () => {
    const object = {
      title: 'test',
    };

    const { isObject, isEmptyObject } = isObjectFactory(object);
    expect(isObject).toBeTruthy();
    expect(isEmptyObject).toBeFalsy();
  });

  it('should detect the object has no properties', () => {
    const object = {};

    const { isObject, isEmptyObject } = isObjectFactory(object);
    expect(isObject).toBeTruthy();
    expect(isEmptyObject).toBeTruthy();
  });

  it('should detect the param is not object', () => {
    const mayNotObject: unknown[] = [];

    const { isObject, isEmptyObject } = isObjectFactory(mayNotObject);
    expect(isObject).toBeFalsy();
    expect(isEmptyObject).toBeFalsy();
  });
});

describe('parseObjectToCssText', () => {
  it('should parse a object to css text', () => {
    const object = { appearance: 'none' };
    const cssText = parseObjectToCssText(object);
    expect(cssText).toBeTruthy();
    expect(cssText).toMatch(/^appearance: none;$/);
  });
});
