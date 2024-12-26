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
      const response = await axios.post('/api/youtube-download', { url });
      const { formats } = response.data;
      console.log(formats)
      setFormats(formats);
    } catch (err) {
      setError('Failed to fetch formats. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

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
      {formats.length > 0 && (
        <div>
          <h2>Select Format</h2>
          <select onChange={(e) => setSelectedFormat(e.target.value)} value={selectedFormat}>
            <option value="">Select a format</option>
            {formats.map((format) => (
              <option key={format.format_id} 
              value={format.format_id} 
              data-download={`${format.format_note}.${format.ext}`}
              data-quality={format.format_note}
              data-type={format.ext}
              data-href={format.url}
              data-title={`format: ${format.format_note}`}>
                format: {format.format_note}.{format.ext} - {format.filesize ? (format.filesize / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown size'}
              </option>
            ))}
          </select>
          <button onClick={handleDownload} disabled={!selectedFormat}>
            Download
          </button>
        </div>
      )}

      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;