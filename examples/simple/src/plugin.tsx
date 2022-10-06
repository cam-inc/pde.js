/* @jsx h */
import {
  h,
  useMount,
  useWatch,
  useState,
  PDJSX,
  createPlugin,
} from '@pdejs/core';

const Plugin = () => {
  const toolbox: PDJSX.ToolAttributes['static_get_toolbox'] = {
    title: 'Simple',
    icon: '⚔️',
  };
  const save: PDJSX.ToolAttributes['save'] = (blockContent) => {
    return blockContent.innerText;
  };

  const [inputValue, setInputValue] = useState('');
  const [submitValue, setSubmitValue] = useState('');
  const handleFormSubmit = (event: Event) => {
    event.preventDefault();
    setSubmitValue(inputValue);
  };
  const handleInputChange = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      setInputValue(event.target.value);
    }
  };

  useMount(() => {
    console.log('[@pdejs/simple] is ready to work!');
  });
  useWatch(() => {
    console.log(`[@pdejs/simple] submitted : `, submitValue);
  }, [submitValue]);

  return (
    <tool save={save} static_get_toolbox={toolbox}>
      <div>
        <form onSubmit={handleFormSubmit}>
          <label>
            type something→
            <input onChange={handleInputChange} value={inputValue} />
          </label>
          <button>submit</button>
        </form>
        <div>
          <span>submitted: </span>
          <span>{submitValue}</span>
        </div>
      </div>
    </tool>
  );
};

export const Simple = createPlugin(<Plugin />);
