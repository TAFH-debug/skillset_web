import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
if (!ffmpegPath) throw new Error('FFmpeg binary not found');
const ffmpegBin = path.join(
  process.cwd(),
  'node_modules/.pnpm/ffmpeg-static@5.2.0/node_modules/ffmpeg-static/ffmpeg.exe'
);
ffmpeg.setFfmpegPath(ffmpegBin);

function secondsToSRTTime(seconds: number): string {
  const date = new Date(0);
  date.setSeconds(Math.floor(seconds));
  const ms = Math.floor((seconds - Math.floor(seconds)) * 1000);
  return [
    String(date.getUTCHours()).padStart(2, '0'),
    String(date.getUTCMinutes()).padStart(2, '0'),
    String(date.getUTCSeconds()).padStart(2, '0'),
    String(ms).padStart(3, '0')
  ].join(':').replace(/:(?=[^:]*$)/, ',');
}

function generateSRT(segments: { start: number; end: number; text: string }[]): string {
  return segments.map((seg, i) =>
    `${i + 1}\n${secondsToSRTTime(seg.start)} --> ${secondsToSRTTime(seg.end)}\n${seg.text.trim()}\n`
  ).join('\n');
}

async function waitForJobCompletion(jobId: string, apiKey: string, maxRetries = 20, intervalMs = 3000) {
  for (let i = 0; i < maxRetries; i++) {
    const res = await fetch(`https://mango.sievedata.com/v2/jobs/${jobId}`, {
      headers: { 'X-API-Key': apiKey }
    });

    if (!res.ok) throw new Error(`Failed to fetch job status: ${res.status}`);
    const data = await res.json();

    if (data.status === 'finished') return data;
    if (data.status === 'failed') throw new Error('Job failed');

    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  throw new Error('Timeout while waiting for job');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { audioUrl } = body;

    if (!audioUrl) {
      return new Response(JSON.stringify({ error: 'audioUrl is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = 'fig tebe';

    const response = await fetch('https://mango.sievedata.com/v2/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        function: 'sieve/transcribe',
        inputs: {
          file: { url: audioUrl },
          backend: 'stable-ts-whisper-large-v3-turbo',
          word_level_timestamps: true,
          source_language: 'auto',
          diarization_backend: 'None',
          min_speakers: -1,
          max_speakers: -1,
          segmentation_backend: 'ffmpeg-silence',
          min_silence_length: 0.4,
          vad_threshold: 0.2,
        },
      }),
    });

    const data = await response.json();
    const jobId = "830c739a-7b0d-4a7a-ac49-8b292cc326b8";

    if (!jobId) {
      return new Response(JSON.stringify({ error: 'No job ID returned from Sieve' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const jobResult = await waitForJobCompletion(jobId, apiKey);
    const segments = jobResult.outputs?.flatMap(output => output?.data?.segments || []) || [];
    console.log(segments);
    if (!segments.length) {
      return new Response(JSON.stringify({ error: 'No segments returned from transcription job' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const srtContent = generateSRT(segments);
    const tempDir = path.join('public', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    fs.writeFileSync('public/temp/test.srt', srtContent);


    const outputFileName = `output-${Date.now()}.mp4`;
    const outputFilePath = path.join(process.cwd(), 'public', outputFileName);

    // Step 4: attach subtitles
    await new Promise<void>((resolve, reject) => {
      ffmpeg(videoPath)
        .complexFilter([
          {
            filter: 'subtitles',
            options: `public/temp/test.srt`,
          }
        ])
        .on('end', () => {
          fs.unlinkSync("public/temp/test.srt");
          resolve();
        })
        .on('error', (err) => {
          fs.unlinkSync("public/temp/test.srt");
          reject(err);
        })
        .save(outputFilePath);
    });

    return new Response(JSON.stringify({ url: `/${outputFileName}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
