/* @jsx h */
import { h, createPlugin, useState, VNode } from '../../src';

describe('useState', () => {
  it('should update state when calling state updater', () => {
    const App = () => {
      const [text, setText] = useState('ping');

      return <span id="test">{text}</span>;
    };

    const plugin = createPlugin((<App />) as VNode);
    // @ts-ignore
    const target = new plugin().render().querySelector('#test');

    expect(plugin).toBeTruthy();
    expect(target?.innerHTML).toMatch('ping');
  });
});
