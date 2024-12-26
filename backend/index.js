const express = require('express');
const youtubedl = require('youtube-dl-exec');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/youtube-download', async (req, res) => {
  const { url } = req.body;
  try {
    const output = await youtubedl(url, {
      dumpSingleJson: true,
    });
    // Filter formats to include only audio and video
    const formats = output.formats.filter(format => format.vcodec !== 'none' || format.acodec !== 'none');

    res.json({ formats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to download video' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});