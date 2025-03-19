import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import TextInput from '../components/TextInput';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [summary, setSummary] = useState('');
  const [copied, setCopied] = useState(false);

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
      body: JSON.stringify({ text, summary_length: 'default' }),
    });
    const data = await response.json();
    setSummary(data.summary);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset "Copied!" after 2 seconds
  };

  return (
    <div>
      <div>
        <h1>Oly</h1>
        <h3>Streamlined Insight</h3>
      </div>
      <FileUpload onFileUpload={handleFileUpload} />
      <TextInput onTextSubmit={handleTextSubmit} />
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 className='essence'>Essence</h2>
          {summary && (
            <span
              onClick={handleCopy}
              style={{ cursor: 'pointer', fontSize: '1.2rem' }}
              title="Copy to clipboard"
            >
              {copied ? '✅' : '📋'}
            </span>
          )}
        </div>
        <div className="summary">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      </div>
      <footer className="footer">
        <p>© 2025 Tuhin Karmakar | Insight, Simplified | <a href="https://github.com/darsonik/olysummerize" target="_blank" rel="noopener noreferrer">GitHub: Darsonik</a></p>
      </footer>
    </div>
  );
}