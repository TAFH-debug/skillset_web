"use client";
import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { Tabs, Tab } from '@heroui/tabs';
import { Button } from '@heroui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

// Initialize ffmpeg-wasm instance
const ffmpeg = new FFmpeg();

const INITIAL_RANGES = [
  { begin: 5, end: 12 },
  { begin: 30, end: 42 },
  { begin: 60, end: 75 },
];

export default function VideoEditor() {
  const playerRef = useRef<any>(null);
  const [ranges, setRanges] = useState(INITIAL_RANGES);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load ffmpeg core on mount
  useEffect(() => {
    ffmpeg.load();
  }, []);

  // Export the current segment using ffmpeg.wasm
  const exportTrim = async () => {
    setLoading(true);

    const { begin, end } = ranges[activeTab];

    // Fetch the source file and write to ffmpeg FS
    const data = await fetchFile('/minecraft.mp4');
    await ffmpeg.writeFile('input.mp4', data);

    // Run the trim command
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-ss', `${begin}`,
      '-to', `${end}`,
      '-c', 'copy',
      'output.mp4',
    ]);

    // Read the trimmed file and trigger download
    const trimmed = await ffmpeg.readFile('output.mp4');
    const url = URL.createObjectURL(
      new Blob([trimmed.buffer], { type: 'video/mp4' })
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = `trim_${begin}-${end}.mp4`;
    a.click();

    // Optionally terminate ffmpeg to free memory
    await ffmpeg.terminate();

    setLoading(false);
  };

  // Update begin/end times in state
  const updateRange = (field: 'begin' | 'end', val: number) => {
    setRanges((rs) =>
      rs.map((r, i) => (i === activeTab ? { ...r, [field]: val } : r))
    );
  };

  return (
    <div className="p-6 space-y-8">
      {/* Hero Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg text-white">
        <h1 className="text-xl font-semibold">Simple Video Trimmer</h1>
      </header>

      {/* Video Player */}
      <div className="aspect-video rounded-xl overflow-hidden shadow">
        <ReactPlayer
          ref={playerRef}
          url="/minecraft.mp4"
          controls
          width="100%"
          height="100%"
          onProgress={({ playedSeconds }) => {
            const { begin, end } = ranges[activeTab];
            // Loop playback within the selected range
            if (playedSeconds < begin || playedSeconds > end) {
              playerRef.current.seekTo(begin, 'seconds');
            }
          }}
        />
      </div>

      {/* Thumbnail Timeline Placeholder */}
      <div className="h-24 bg-gray-100 rounded flex items-center justify-center">
        <span className="text-gray-500">[Thumbnail Timeline Here]</span>
      </div>

      {/* Time Inputs */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <span>Start (s):</span>
          <input
            type="number"
            value={ranges[activeTab].begin}
            onChange={(e) => updateRange('begin', +e.target.value)}
            className="w-20 p-1 border rounded"
          />
        </label>
        <label className="flex items-center space-x-2">
          <span>End (s):</span>
          <input
            type="number"
            value={ranges[activeTab].end}
            onChange={(e) => updateRange('end', +e.target.value)}
            className="w-20 p-1 border rounded"
          />
        </label>
      </div>

      {/* HeroUI Tabs for Multiple Segments */}
      <Tabs
        selectedKey={String(activeTab)}
        onSelectionChange={(key) => setActiveTab(Number(key))}
        className="bg-gray-50 rounded-lg p-2"
      >
        {ranges.map((range, i) => (
          <Tab
            key={i}
            itemKey={String(i)}
            title={
              <div className="flex items-center gap-1">
                <ChevronLeft size={14} /> Segment {i + 1} <ChevronRight size={14} />
              </div>
            }
            className="px-3 py-1 rounded hover:bg-gray-200"
          >
            <p>
              <strong>Segment {i + 1}:</strong> {range.begin}s — {range.end}s
            </p>
          </Tab>
        ))}
      </Tabs>

      {/* Export Button */}
      <div>
        <Button
          variant="solid"
          onClick={exportTrim}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Exporting…' : 'Export Current Segment'}
        </Button>
      </div>
    </div>
  );
}
