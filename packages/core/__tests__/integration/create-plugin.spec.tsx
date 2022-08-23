/* @jsx h */
import { h, createPlugin, VNode } from '../../src';

describe('createPlugin', () => {
  it('should create a plugin class', () => {
    const Plugin = () => (
      <tool save={() => {}}>
        {/*@ts-ignore*/}
        <div></div>
      </tool>
    );

    const plugin = createPlugin((<Plugin />) as unknown as VNode);
    expect(plugin).toBeTruthy();
  });
});
