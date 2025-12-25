import React from 'react';

/**
 * VideoPlayer component for embedding Vimeo videos
 * Responsive player that maintains 16:9 aspect ratio
 */
const VideoPlayer = ({ vimeoId, title }) => {
  return (
    <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg bg-gray-900">
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        title={title}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};

export default VideoPlayer;
