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

const clipMap = [
  { id: 0, title: 'WATER BUCKET RELEASE', begin: 5, end: 12 },
  { id: 1, title: 'FLINT AND STEEL', begin: 30, end: 42 },
  { id: 2, title: 'ELYTRA', begin: 70, end: 84 },
];

export default function VideoEditor() {
  const playerRef = useRef<any>(null);
  const [ranges, setRanges] = useState(clipMap);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load ffmpeg core on mount
  useEffect(() => {
    ffmpeg.load();
  }, []);

  // Export the current segment using ffmpeg.wasm
  const exportClip = async () => {
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
    a.download = `clip_${ranges[activeTab].title}.mp4`;
    a.click();

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

      <div className='flex flex-row gap-5 justify-between'>

        {/* Video Player */}
        <div className="aspect-video rounded-xl overflow-hidden shadow w-1/2" >
          <ReactPlayer
            ref={playerRef}
            url="/minecraft.mp4"
            controls
            width="100%"
            height="100%"
            onProgress={({ playedSeconds }) => {
              const { begin, end } = ranges[activeTab];
              // loop the selected clip
              if (playedSeconds < begin || playedSeconds > end) {
                playerRef.current.seekTo(begin, 'seconds');
              }
            }}
          />
        </div>

        <div className='flex flex-col w-1/2 justify-between'>
          {/* HeroUI Tabs for Multiple Segments */}
          <div>
            <Tabs
              selectedKey={String(activeTab)}
              onSelectionChange={(key) => setActiveTab(Number(key))}
              items={clipMap}
            >
              {(item) => (
                <Tab
                  key={item.id}
                  title={
                    <div className="flex items-center gap-1">
                      <ChevronLeft size={14} /> Clip {item.id + 1} <ChevronRight size={14} />
                    </div>
                  }
                >
                  <p>
                    <strong>Clip {item.id}:</strong> {item.title}
                  </p>
                </Tab>
              )}
            </Tabs>

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

          </div>

          {/* Export Button */}
          <div>
            <Button
              variant="solid"
              onClick={exportClip}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Exporting…' : 'Export Current Segment'}
            </Button>
          </div>
        </div>
      </div>


      {/* Thumbnail Timeline Placeholder */}
      {/* <div className="h-24 bg-gray-100 rounded flex items-center justify-center">
        <span className="text-gray-500">[Thumbnail Timeline Here]</span>
      </div> */}




    </div>
  );
}
