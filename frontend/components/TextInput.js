import React, { useState } from 'react';

const TextInput = ({ onTextSubmit }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    onTextSubmit(text);
  };

  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default TextInput;
