import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import TextInput from '../components/TextInput';

export default function Home() {
  const [summary, setSummary] = useState('');

  const handleFileUpload = (text) => {
    fetchSummary(text);
  };

  const handleTextSubmit = (text) => {
    fetchSummary(text);
  };

  const fetchSummary = async (text) => {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, summary_length: 'short' }),
    });
    const data = await response.json();
    setSummary(data.summary);
  };

  return (
    <div>
      <div>
      <h1>Oly</h1>
      <h3>AI Summerizer</h3>
      </div>
      
      <FileUpload onFileUpload={handleFileUpload} />
      <TextInput onTextSubmit={handleTextSubmit} />
      <div>
        <h2>Summary</h2>
        <p>{summary}</p>
      </div>
    </div>
  );
}
