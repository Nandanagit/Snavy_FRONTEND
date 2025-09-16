// Usage: node scripts/get-audio-duration.js <audio_url> <output_file>
const fs = require('fs');
const https = require('https');
const http = require('http');
const { parseFile } = require('music-metadata');

async function downloadFile(url, dest) {
  const file = fs.createWriteStream(dest);
  const mod = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    mod.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error('Failed to download file: ' + response.statusCode));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', reject);
  });
}

async function main() {
  const audioUrl = process.argv[2] || 'http://localhost:6001/audio/audioo.wav';
  const output = process.argv[3] || 'src/remotion/audioDuration.json';
  const tempFile = 'temp-audio-file';

  await downloadFile(audioUrl, tempFile);
  const metadata = await parseFile(tempFile);
  const duration = metadata.format.duration; // seconds
  fs.unlinkSync(tempFile);

  fs.writeFileSync(output, JSON.stringify({ duration }));
  console.log('Audio duration:', duration, 'seconds. Written to', output);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
