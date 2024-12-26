import React, { useState } from 'react';
import axios from 'axios';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formats, setFormats] = useState<any[]>([]);
  const [selectedFormat, setSelectedFormat] = useState('');

  const handleFetchFormats = async () => {
    setLoading(true);
    setError('');
    try {
      const formdata = new FormData();
      formdata.append("url", url);
  
      const requestOptions = {
        method: "POST",
        body: formdata,
      };
      const response = await fetch(`https://my-express-api-gamma.vercel.app/yt?url=${url}`);
      const result = await response.json();
      console.log(result)
      setFormats(result);
    } catch (err) {
      setError('Failed to fetch formats. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const initialLoad=async()=>{
    const response = await fetch("https://my-express-api-gamma.vercel.app");
      const result = await response.json();
      console.log(result)
  }

  const handleDownload = () => {
    const format = formats.find(f => f.format_id === selectedFormat);
    if (format) {
      const link = document.createElement('a');
      link.href = format.url;
      link.download = format.format_note + '.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h1>YouTube Downloader</h1>
      <button onClick={initialLoad} >
      Fetch
      </button>
      <input
        type="text"
        placeholder="Enter YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={handleFetchFormats} disabled={loading}>
        {loading ? 'Fetching formats...' : 'Fetch Formats'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;